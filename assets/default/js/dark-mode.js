/**
 * Advanced Dark Mode Switcher for Laravel
 * ملف JavaScript للوضع الليلي
 */

class AdvancedDarkModeSwitcher {
  constructor(options = {}) {
    this.options = {
      transitionDuration: options.transitionDuration || '0.3s',
      savePreference: options.savePreference !== false,
      autoDetect: options.autoDetect || false,
      ...options
    };
    
    this.isDark = false;
    this.observer = null;
    this.processedElements = new WeakSet();
    this.init();
  }

  init() {
    // التحقق من التفضيل المحفوظ أولاً
    const hasStored = this.hasStoredPreference();
    
    if (hasStored) {
      this.loadPreference();
    } else if (this.options.autoDetect) {
      // إذا لم يكن هناك تفضيل محفوظ، استخدم تفضيل النظام
      this.detectSystemPreference();
    }
    
    // الاستماع لتغييرات تفضيل النظام
    this.listenToSystemChanges();
    
    // الاستماع لحدث الضغط على الزر
    this.attachButtonListener();
  }

  attachButtonListener() {
    const button = document.getElementById('dark-mode-toggle');
    if (button) {
      button.addEventListener('click', () => this.toggle());
      this.updateButtonIcon();
    }
  }

  toggle() {
    this.isDark = !this.isDark;
    
    if (this.isDark) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }

    if (this.options.savePreference) {
      this.savePreference();
    }

    this.updateButtonIcon();

    if (this.options.onChange) {
      this.options.onChange(this.isDark);
    }
  }

  enableDarkMode() {
  document.body.classList.add('dark-mode-active');
  
  // تطبيق لون الخلفية #121212 على الـ body
  document.body.style.setProperty('background-color', '#121212', 'important');
  
  // تطبيق نفس اللون على عناصر .webinar-card__content
  document.querySelectorAll('.webinar-card__content').forEach(el => {
    el.style.setProperty('background-color', '#1c1c1c', 'important');
  });

  // حقن CSS خاص بتأثير hover
  this.injectHoverStyles();

  // إضافة CSS لمنع تغيير لون الخلفية عند hover على الجداول
  this.injectTableHoverStyles();
  
  // معالجة جميع العناصر (باستثناء الـ body)
  this.processAllElements();
  
  // مراقبة التغييرات الديناميكية
  this.startObserver();
}

injectHoverStyles() {
  const existing = document.getElementById('dark-mode-hover-styles');
  if (existing) existing.remove();

  const style = document.createElement('style');
  style.id = 'dark-mode-hover-styles';
  style.textContent = `
    /* اللون الأساسي */
    .dark-mode-active {
      --dark-bg: #121212;
      --dark-hover: #191919;
    }

 

    /* استثناءات */
    .dark-mode-active img:hover,
    .dark-mode-active video:hover,
    .dark-mode-active svg:hover {
      background-color: transparent !important;
    }

    /* عند اختيار إجابة في الاختبار */
    .dark-mode-active .quiz-form .question-multi-answers .answer-item input[type="radio"]:checked + .answer-label {
      background-color: var(--dark-bg) !important;
      color: #fff !important;
      border-color: #333 !important;
      transition: background-color 0.3s ease !important;
    }

    /* عند تمرير الماوس على الإجابات */
    .dark-mode-active .quiz-form .question-multi-answers .answer-item .answer-label:hover {
      background-color: var(--dark-hover) !important;
    }
  `;
  document.head.appendChild(style);
}


  disableDarkMode() {
    document.body.classList.remove('dark-mode-active');
    
    // استعادة لون الخلفية الأصلي للـ body
    document.body.style.removeProperty('background-color');
    
    // إزالة CSS الخاص بالجداول
    this.removeTableHoverStyles();
    
    // إزالة جميع التعديلات
    this.restoreAllElements();
    
    // إيقاف المراقبة
    this.stopObserver();
  }

  injectTableHoverStyles() {
    // إزالة الـ style السابق إن وجد
    const existingStyle = document.getElementById('dark-mode-table-hover-fix');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // إنشاء style جديد
    const style = document.createElement('style');
    style.id = 'dark-mode-table-hover-fix';
    style.textContent = `
      /* منع تغيير لون الخلفية عند hover على عناصر الجداول */
      .dark-mode-active table tr:hover,
      .dark-mode-active table tbody tr:hover,
      .dark-mode-active table thead tr:hover,
      .dark-mode-active table tfoot tr:hover,
      .dark-mode-active tr:hover,
      .dark-mode-active tbody tr:hover,
      .dark-mode-active thead tr:hover,
      .dark-mode-active tfoot tr:hover,
      .dark-mode-active td:hover,
      .dark-mode-active th:hover {
        background-color: inherit !important;
      }
      
      /* الحفاظ على لون الخلفية الأصلي للجداول */
      .dark-mode-active table,
      .dark-mode-active table tr,
      .dark-mode-active table td,
      .dark-mode-active table th {
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  removeTableHoverStyles() {
    const style = document.getElementById('dark-mode-table-hover-fix');
    if (style) {
      style.remove();
    }
  }

  processAllElements() {
    const allElements = document.querySelectorAll('*:not(body):not(#dark-mode-toggle):not(img):not(video):not(canvas)');
    
    allElements.forEach(element => {
      if (!this.processedElements.has(element)) {
        this.processElement(element);
        this.processedElements.add(element);
        
        // معالجة SVG بشكل خاص
        if (element.tagName === 'svg' || element.closest('svg')) {
          this.processSVG(element);
        }
      }
    });
    
    // معالجة جميع عناصر SVG
    document.querySelectorAll('svg, svg *').forEach(el => {
      this.processSVG(el);
    });
  }

  processElement(element) {
    // تخزين الألوان الأصلية
    if (!element.dataset.originalStyles) {
      const computedStyle = window.getComputedStyle(element);
      element.dataset.originalStyles = JSON.stringify({
        color: computedStyle.color,
        backgroundColor: computedStyle.backgroundColor,
        borderColor: computedStyle.borderColor
      });
    }

    const computedStyle = window.getComputedStyle(element);
    
    // معالجة لون النص - تحويل كل النصوص للأبيض
    element.style.setProperty('color', '#e8e8e8', 'important');

    // معالجة لون الخلفية بذكاء
    const bgColor = computedStyle.backgroundColor;
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
      const brightness = this.getColorBrightness(bgColor);
      
      // فقط إذا كانت الخلفية فاتحة جداً
      if (brightness > 200) {
        const darkBgColor = this.convertToDarkBackground(bgColor);
        element.style.setProperty('background-color', darkBgColor, 'important');
      } else if (brightness > 128 && brightness <= 200) {
        // خلفيات متوسطة - نعتمها قليلاً
        const darkerBg = this.darkenColor(bgColor, 0.3);
        element.style.setProperty('background-color', darkerBg, 'important');
      }
      // الخلفيات الداكنة أصلاً لا نغيرها
    }

    // معالجة الحدود
    const borderColor = computedStyle.borderColor;
    if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
      const darkBorderColor = this.convertToDarkColor(borderColor);
      element.style.setProperty('border-color', darkBorderColor, 'important');
    }
  }

  restoreAllElements() {
    const allElements = document.querySelectorAll('[data-original-styles]');
    
    allElements.forEach(element => {
      try {
        element.style.removeProperty('color');
        element.style.removeProperty('background-color');
        element.style.removeProperty('border-color');
        delete element.dataset.originalStyles;
      } catch (e) {}
    });
    
    // استعادة SVG
    document.querySelectorAll('[data-original-svg-fill]').forEach(element => {
      const originalFill = element.dataset.originalSvgFill;
      const originalStroke = element.dataset.originalSvgStroke;
      
      if (originalFill) {
        element.setAttribute('fill', originalFill);
      } else {
        element.removeAttribute('fill');
      }
      
      if (originalStroke) {
        element.setAttribute('stroke', originalStroke);
      } else {
        element.removeAttribute('stroke');
      }
      
      element.style.removeProperty('fill');
      element.style.removeProperty('stroke');
      
      delete element.dataset.originalSvgFill;
      delete element.dataset.originalSvgStroke;
    });
    
    this.processedElements = new WeakSet();
  }

  processSVG(element) {
    // حفظ الألوان الأصلية
    if (!element.dataset.originalSvgFill) {
      element.dataset.originalSvgFill = element.getAttribute('fill') || '';
      element.dataset.originalSvgStroke = element.getAttribute('stroke') || '';
    }
    
    // تحويل fill و stroke للأبيض
    const fill = element.getAttribute('fill');
    const stroke = element.getAttribute('stroke');
    
    if (fill && fill !== 'none') {
      element.setAttribute('fill', '#e8e8e8');
    }
    
    if (stroke && stroke !== 'none') {
      element.setAttribute('stroke', '#e8e8e8');
    }
    
    // معالجة الـ style
    if (element.style.fill && element.style.fill !== 'none') {
      element.style.fill = '#e8e8e8';
    }
    
    if (element.style.stroke && element.style.stroke !== 'none') {
      element.style.stroke = '#e8e8e8';
    }
  }

  getColorBrightness(color) {
    const rgb = this.parseColor(color);
    if (!rgb) return 255;
    
    return (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
  }

  parseColor(color) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;
    
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    };
  }

  convertToDarkColor(color) {
    const rgb = this.parseColor(color);
    if (!rgb) return color;
    
    const brightness = this.getColorBrightness(color);
    
    if (brightness > 128) {
      return `rgb(${Math.max(0, 255 - rgb.r)}, ${Math.max(0, 255 - rgb.g)}, ${Math.max(0, 255 - rgb.b)})`;
    }
    
    return color;
  }

  convertToDarkBackground(color) {
    const rgb = this.parseColor(color);
    if (!rgb) return '#0e0e0e';
    
    const darkR = Math.floor(rgb.r * 0.1);
    const darkG = Math.floor(rgb.g * 0.1);
    const darkB = Math.floor(rgb.b * 0.1);
    
    return `rgb(${darkR}, ${darkG}, ${darkB})`;
  }

  darkenColor(color, factor) {
    const rgb = this.parseColor(color);
    if (!rgb) return color;
    
    return `rgb(${Math.floor(rgb.r * (1 - factor))}, ${Math.floor(rgb.g * (1 - factor))}, ${Math.floor(rgb.b * (1 - factor))})`;
  }

  startObserver() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && !this.processedElements.has(node)) {
            this.processElement(node);
            this.processedElements.add(node);
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  stopObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  updateButtonIcon() {
    const button = document.getElementById('dark-mode-toggle');
    if (button) {
      const icon = button.querySelector('.dark-mode-icon');
      if (icon) {
        icon.textContent = this.isDark ? '☀️' : '🌙';
      }
      button.title = this.isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي';
    }
  }

  savePreference() {
    localStorage.setItem('advancedDarkMode', this.isDark ? 'enabled' : 'disabled');
  }

  loadPreference() {
    if (!this.options.savePreference) return;
    
    const preference = localStorage.getItem('advancedDarkMode');
    if (preference === 'enabled') {
      this.isDark = true;
      this.enableDarkMode();
      this.updateButtonIcon();
    } else if (preference === 'disabled') {
      this.isDark = false;
      this.disableDarkMode();
      this.updateButtonIcon();
    }
  }

  hasStoredPreference() {
    return localStorage.getItem('advancedDarkMode') !== null;
  }

  detectSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDark = true;
      this.enableDarkMode();
      this.updateButtonIcon();
    } else {
      this.isDark = false;
      this.disableDarkMode();
      this.updateButtonIcon();
    }
  }

  listenToSystemChanges() {
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // للمتصفحات الحديثة
      if (darkModeQuery.addEventListener) {
        darkModeQuery.addEventListener('change', (e) => {
          // فقط إذا لم يكن المستخدم قد اختار تفضيل يدوي
          if (!this.hasStoredPreference()) {
            if (e.matches) {
              this.isDark = true;
              this.enableDarkMode();
            } else {
              this.isDark = false;
              this.disableDarkMode();
            }
            this.updateButtonIcon();
          }
        });
      }
      // للمتصفحات القديمة
      else if (darkModeQuery.addListener) {
        darkModeQuery.addListener((e) => {
          if (!this.hasStoredPreference()) {
            if (e.matches) {
              this.isDark = true;
              this.enableDarkMode();
            } else {
              this.isDark = false;
              this.disableDarkMode();
            }
            this.updateButtonIcon();
          }
        });
      }
    }
  }

  enable() {
    if (!this.isDark) this.toggle();
  }

  disable() {
    if (this.isDark) this.toggle();
  }

  destroy() {
    this.stopObserver();
    this.disableDarkMode();
    this.removeTableHoverStyles();
  }
}

// تصدير للاستخدام في Laravel
if (typeof window !== 'undefined') {
  window.AdvancedDarkModeSwitcher = AdvancedDarkModeSwitcher;
}

// تهيئة تلقائية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  window.darkMode = new AdvancedDarkModeSwitcher({
    autoDetect: true,
    savePreference: true
  });
});

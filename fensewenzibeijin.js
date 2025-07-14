// 创建样式
const style = document.createElement('style');
style.textContent = `
  .pink-text-shadow {
    background-color: rgba(255, 182, 193, 0.5) !important;
    box-shadow: 0 0 8px rgba(255, 182, 193, 0.7) !important;
    border-radius: 2px !important;
    padding: 1px 3px !important;
  }
`;
document.head.appendChild(style);

// 获取页面所有包含文本的元素
function getAllTextElements() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textElements = [];
  let node;
  while (node = walker.nextNode()) {
    if (node.nodeValue.trim() !== '') {
      let parent = node.parentNode;
      // 跳过script/style等元素
      if (parent.nodeType === Node.ELEMENT_NODE && 
          !['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE'].includes(parent.tagName)) {
        textElements.push(parent);
      }
    }
  }
  return [...new Set(textElements)]; // 去重
}

// 为元素添加粉色阴影
function addPinkShadow() {
  const elements = getAllTextElements();
  elements.forEach(el => {
    // 检查元素是否已经是粉色阴影
    if (!el.classList.contains('pink-text-shadow')) {
      // 保存原始样式以便恢复
      if (!el.dataset.originalBackground) {
        el.dataset.originalBackground = el.style.backgroundColor || '';
      }
      if (!el.dataset.originalBoxShadow) {
        el.dataset.originalBoxShadow = el.style.boxShadow || '';
      }
      if (!el.dataset.originalPadding) {
        el.dataset.originalPadding = el.style.padding || '';
      }
      
      el.classList.add('pink-text-shadow');
    }
  });
}

// 移除粉色阴影
function removePinkShadow() {
  document.querySelectorAll('.pink-text-shadow').forEach(el => {
    el.classList.remove('pink-text-shadow');
    // 恢复原始样式
    el.style.backgroundColor = el.dataset.originalBackground;
    el.style.boxShadow = el.dataset.originalBoxShadow;
    el.style.padding = el.dataset.originalPadding;
  });
}

// 创建控制按钮
function createControlButton() {
  const btn = document.createElement('button');
  btn.textContent = '切换粉色文本阴影';
  btn.style.position = 'fixed';
  btn.style.bottom = '20px';
  btn.style.right = '20px';
  btn.style.zIndex = '9999';
  btn.style.padding = '8px 12px';
  btn.style.backgroundColor = 'pink';
  btn.style.border = 'none';
  btn.style.borderRadius = '4px';
  btn.style.cursor = 'pointer';
  
  let isActive = false;
  
  btn.addEventListener('click', () => {
    isActive = !isActive;
    if (isActive) {
      addPinkShadow();
      btn.textContent = '移除粉色阴影';
      btn.style.backgroundColor = 'hotpink';
    } else {
      removePinkShadow();
      btn.textContent = '添加粉色阴影';
      btn.style.backgroundColor = 'pink';
    }
  });
  
  document.body.appendChild(btn);
}

// 初始化
createControlButton();
addPinkShadow(); // 默认开启

// 监听DOM变化动态添加样式
const observer = new MutationObserver((mutations) => {
  if (document.querySelector('.pink-text-shadow')) {
    addPinkShadow();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
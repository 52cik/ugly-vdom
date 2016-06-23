/**
 * 创建 vdom
 * @param  {String}    tagName    标签名
 * @param  {Object}    props      属性节点
 * @param  {...[Object]} children 子节点
 * @return {Object}               vdom 节点
 */
function createElement(tagName, props, ...children) {
  let vnode = {
    tagName,
    props,
    children
  }

  return vnode
}

/**
 * 渲染 vdom 到 dom
 * @param  {Object}   nextElement   vdom 节点
 * @param  {Element}  container dom 节点
 * @param  {Function} callback  回调函数
 * @return {Element}
 */
function render(nextElement, container, callback) {
  let el = document.createElement(nextElement.tagName)

  if (nextElement.props) {
    for (let prop in nextElement.props) {
      el.setAttribute(prop, nextElement.props[prop])
    }
  }

  nextElement.children.forEach((child) => {
    typeof child == 'string'
    ? el.appendChild(document.createTextNode(child))
    : render(child, el)
  })

  container.appendChild(el)
  return container
}

/**
 * 导出
 */
export default {
  createElement,
  render
}

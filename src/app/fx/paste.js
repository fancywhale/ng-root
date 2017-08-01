export function pasteHandler(ele) {
  $(ele).find('[paste-text]').each(function (index,$ele) {
    if (ele[0].getAttribute('paste-text') === 'true') return;
    
  })
}

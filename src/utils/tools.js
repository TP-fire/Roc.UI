// 是否有效 返回一个span标签
export const renderIsEnabled = (h, params) => {
    let type = params.row[params.column.key];
    return h(
      "span", {
        style: {
          color: type === 1 ? "#4bcb0d" : '#ec7050',
          backgroundColor: type === 1 ? "#eefde3" : "#fde3e6",
          border: type === 1 ? "1px solid #4bcb0d" : "1px solid #ec7050",
          padding: "1px 10px",
          margin: "3px 0",
          borderRadius: "3px",
          cursor: "default",
        },
      },
      type === 1 ? window.$Vue.$t("yes") : window.$Vue.$t("no")
    );
  };

export const exportFile = (blob , filename) =>{
  if(window.navigator && window.navigator.msSaveOrOpenBlob){
    navigator.msSaveBlob(blob , filename)
  } else{
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.style.display = 'none'
    link.click()
    URL.revokeObjectURL(link.URL)
    document.body.removeChild(link)
  }
}
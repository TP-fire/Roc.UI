/*!
 * Image (upload) dialog plugin for Editor.md
 *
 * @file        image-dialog.js
 * @author      pandao
 * @version     1.3.4
 * @updateTime  2015-06-09
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */

(function() {

    var factory = function (exports) {

		var pluginName   = "image-dialog";

		exports.fn.imageDialog = function() {

            var _this       = this;
            var cm          = this.cm;
            var lang        = this.lang;
            var editor      = this.editor;
            var settings    = this.settings;
            var cursor      = cm.getCursor();
            var selection   = cm.getSelection();
            var imageLang   = lang.dialog.image;
            var classPrefix = this.classPrefix;
            var iframeName  = classPrefix + "image-iframe";
			var dialogName  = classPrefix + pluginName, dialog;

			cm.focus();

            var loading = function(show) {
                var _loading = dialog.find("." + classPrefix + "dialog-mask");
                _loading[(show) ? "show" : "hide"]();
            };

            if (editor.find("." + dialogName).length < 1)
            {
                var guid   = (new Date).getTime();
                var action = settings.imageUploadURL + (settings.imageUploadURL.indexOf("?") >= 0 ? "&" : "?") + "guid=" + guid;

                if (settings.crossDomainUpload)
                {
                    action += "&callback=" + settings.uploadCallbackURL + "&dialog_id=editormd-image-dialog-" + guid;
                }

                //注释的是官方的写法
                // var dialogContent = ( (settings.imageUpload) ? "<form action=\"" + action +"\" target=\"" + iframeName + "\" method=\"post\" enctype=\"multipart/form-data\" class=\"" + classPrefix + "form\">" : "<div class=\"" + classPrefix + "form\">" ) +
                //                         ( (settings.imageUpload) ? "<iframe name=\"" + iframeName + "\" id=\"" + iframeName + "\" guid=\"" + guid + "\"></iframe>" : "" ) +
                //                         "<label>" + imageLang.url + "</label>" +
                //                         "<input type=\"text\" data-url />" + (function(){
                //                             return (settings.imageUpload) ? "<div class=\"" + classPrefix + "file-input\">" +
                //                                                                 "<input type=\"file\" name=\"" + classPrefix + "image-file\" accept=\"image/*\" />" +
                //                                                                 "<input type=\"submit\" value=\"" + imageLang.uploadButton + "\" />" +
                //                                                             "</div>" : "";
                //                         })() +
                //                         "<br/>" +
                //                         "<label>" + imageLang.alt + "</label>" +
                //                         "<input type=\"text\" value=\"" + selection + "\" data-alt />" +
                //                         "<br/>" +
                //                         "<label>" + imageLang.link + "</label>" +
                //                         "<input type=\"text\" value=\"http://\" data-link />" +
                //                         "<br/>" +
                //                     ( (settings.imageUpload) ? "</form>" : "</div>");



                //这是我个人写法
                var dialogContent = ( (settings.imageUpload) ? "<form action=\"#\" target=\"" + iframeName + "\" method=\"post\" enctype=\"multipart/form-data\" class=\"" + classPrefix + "form\">" : "<div class=\"" + classPrefix + "form\">" ) +
                    ( (settings.imageUpload) ? "<iframe name=\"" + iframeName + "\" id=\"" + iframeName + "\" guid=\"" + guid + "\"></iframe>" : "" ) +
                    "<label>" + imageLang.url + "</label>" +
                    "<input type=\"text\" data-url />" + (function(){
                        return (settings.imageUpload) ? "<div class=\"" + classPrefix + "file-input\">" +
                            "<input type=\"file\" name=\"" + classPrefix + "image-file\" id=\"" + classPrefix + "image-file\" accept=\"image/*\" />" +
                            "<input type=\"submit\" value=\"" + imageLang.uploadButton + "\" />" +
                            "</div>" : "";
                    })() +
                    "<br/>" +
                    "<label>" + imageLang.alt + "</label>" +
                    "<input type=\"text\" value=\"" + selection + "\" data-alt />" +
                    "<br/>" +
                    "<label>" + imageLang.link + "</label>" +
                    "<input type=\"text\" value=\"http://\" data-link />" +
                    "<br/>" +
                    ( (settings.imageUpload) ? "</form>" : "</div>");




                //这是官方的，不知道为什么，官方把它给注释掉了
                //var imageFooterHTML = "<button class=\"" + classPrefix + "btn " + classPrefix + "image-manager-btn\" style=\"float:left;\">" + imageLang.managerButton + "</button>";

                dialog = this.createDialog({
                    title      : imageLang.title,
                    width      : (settings.imageUpload) ? 465 : 380,
                    height     : 254,
                    name       : dialogName,
                    content    : dialogContent,
                    mask       : settings.dialogShowMask,
                    drag       : settings.dialogDraggable,
                    lockScreen : settings.dialogLockScreen,
                    maskStyle  : {
                        opacity         : settings.dialogMaskOpacity,
                        backgroundColor : settings.dialogMaskBgColor
                    },
                    buttons : {
                        enter : [lang.buttons.enter, function() {
                            var url  = this.find("[data-url]").val();
                            var alt  = this.find("[data-alt]").val();
                            var link = this.find("[data-link]").val();

                            if (url === "")
                            {
                                alert(imageLang.imageURLEmpty);
                                return false;
                            }

							var altAttr = (alt !== "") ? " \"" + alt + "\"" : "";

                            if (link === "" || link === "http://")
                            {
                                cm.replaceSelection("![" + alt + "](" + url + altAttr + ")");
                            }
                            else
                            {
                                cm.replaceSelection("[![" + alt + "](" + url + altAttr + ")](" + link + altAttr + ")");
                            }

                            if (alt === "") {
                                cm.setCursor(cursor.line, cursor.ch + 2);
                            }

                            this.hide().lockScreen(false).hideMask();

                            //删除对话框
                            this.remove();

                            return false;
                        }],

                        cancel : [lang.buttons.cancel, function() {
                            this.hide().lockScreen(false).hideMask();

                            //删除对话框
                            this.remove();
                            
                            return false;
                        }]
                    }
                });

                dialog.attr("id", classPrefix + "image-dialog-" + guid);

				if (!settings.imageUpload) {
                    return ;
                }

				var fileInput  = dialog.find("[name=\"" + classPrefix + "image-file\"]");

				fileInput.bind("change", function() {
					var fileName  = fileInput.val();
					var isImage   = new RegExp("(\\.(" + settings.imageFormats.join("|") + "))$", "i"); // /(\.(webp|jpg|jpeg|gif|bmp|png))$/

					if (fileName === "")
					{
						alert(imageLang.uploadFileEmpty);

                        return false;
					}

                    if (!isImage.test(fileName))
					{
						alert(imageLang.formatNotAllowed + settings.imageFormats.join(", "));

                        return false;
					}

                    loading(true);

                    var submitHandler = function() {


                        var uploadIframe = document.getElementById(iframeName);

                        uploadIframe.onload = function() {

                            loading(false);

                            //注释的是官方写法
                            // var body = (uploadIframe.contentWindow ? uploadIframe.contentWindow : uploadIframe.contentDocument).document.body;
                            // var json = (body.innerText) ? body.innerText : ( (body.textContent) ? body.textContent : null);
                            //
                            // json = (typeof JSON.parse !== "undefined") ? JSON.parse(json) : eval("(" + json + ")");
                            //
                            // if(!settings.crossDomainUpload)
                            // {
                            //   if (json.success === 1)
                            //   {
                            //       dialog.find("[data-url]").val(json.url);
                            //   }
                            //   else
                            //   {
                            //       alert(json.message);
                            //   }
                            // }
                            //
                            // return false;


                            //这是我个人写法
                            var formData = new FormData();
                            formData.append("data",$("#editormd-image-file")[0].files[0]);
                            var action = settings.imageUploadURL + (settings.imageUploadURL.indexOf("?") >= 0 ? "&" : "?") + "guid=" + guid;

                            $.ajax({
                                type:"post",
                                url:action,
                                data:formData,
                                dataType:"json",
                                async:false,
                                processData : false, // 使数据不做处理
                                contentType : false, // 不要设置Content-Type请求头
                                success:function(data){
                                    // 成功拿到结果放到这个函数 data就是拿到的结果
                                    console.log(data);
                                    if(data.code == 200){
                                        console.log(data.message);
                                        dialog.find("[data-url]").val(data.result.url);
                                    }else{
                                        alert(data.message);
                                    }
                                },
                            });

                            return false;
                        };






                    };

                    dialog.find("[type=\"submit\"]").bind("click", submitHandler).trigger("click");
				});
            }

			dialog = editor.find("." + dialogName);
			dialog.find("[type=\"text\"]").val("");
			dialog.find("[type=\"file\"]").val("");
			dialog.find("[data-link]").val("http://");

			this.dialogShowMask(dialog);
			this.dialogLockScreen();
			dialog.show();

		};

	};

	// CommonJS/Node.js
	if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    {
        module.exports = factory;
    }
	else if (typeof define === "function")  // AMD/CMD/Sea.js
    {
		if (define.amd) { // for Require.js

			define(["editormd"], function(editormd) {
                factory(editormd);
            });

		} else { // for Sea.js
			define(function(require) {
                var editormd = require("./../../editormd");
                factory(editormd);
            });
		}
	}
	else
	{
        factory(window.editormd);
	}

})();


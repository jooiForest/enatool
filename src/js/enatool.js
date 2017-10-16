/*
    自动渲染器
    专注布局
    by jooiForest
*/

(function(window){
    var module = {},BROWSER;
    // 是否自动渲染 渲染开关
    module.AUTO_RENDER = true;
    // 是否窗体正在变化
    module.RESIZEING = false;
    // 是否侦听窗体变化
    module.LISTENTER_RESIZE = true;
    // 全局延迟等级
    module.SETTIME_TIME = 200;
    //全局布局配置
    module.UI_LAYOUT = ["g-layouted","g-layout", "g-max", "g-h-max", "g-w-max", "g-h-auto", "g-w-auto"];
    // 宽高不计算对象classname:选择器
    module.NO_SIZE = ".u-float";

    /*---------功能操作--------*/

    // 获取浏览器
    module.getBrowser = function () {
        var pf = (navigator.platform || "").toLowerCase(),
            ua = navigator.userAgent.toLowerCase(),
            s;
        if (BROWSER) {
            return BROWSER;
        }
        BROWSER = {};
        function toFixedVersion(ver, floatLength) {
            ver = ("" + ver).replace(/_/g, ".");
            floatLength = floatLength || 1;
            ver = String(ver).split(".");
            ver = ver[0] + "." + (ver[1] || "0");
            ver = Number(ver).toFixed(floatLength);
            return ver;
        }

        function updateProperty(target, name, ver) {
            target = BROWSER[target]
            target.name = name;
            target.version = ver;
            target[name] = ver;
        }

        // 提供三个对象,每个对象都有name, version(version必然为字符串)
        // 取得用户操作系统名字与版本号，如果是0表示不是此操作系统
        var platform = BROWSER.platform = {
            name: (window.orientation != undefined) ? 'iPod' : (pf.match(/mac|win|linux/i) || ['unknown'])[0],
            version: 0,
            iPod: 0,
            iPad: 0,
            iPhone: 0,
            android: 0,
            win: 0,
            linux: 0,
            mac: 0
        };

        (s = ua.match(/windows ([\d.]+)/)) ? updateProperty("platform", "win", toFixedVersion(s[1])) :
            (s = ua.match(/windows nt ([\d.]+)/)) ? updateProperty("platform", "win", toFixedVersion(s[1])) :
                (s = ua.match(/linux ([\d.]+)/)) ? updateProperty("platform", "linux", toFixedVersion(s[1])) :
                    (s = ua.match(/mac ([\d.]+)/)) ? updateProperty("platform", "mac", toFixedVersion(s[1])) :
                        (s = ua.match(/ipod ([\d.]+)/)) ? updateProperty("platform", "iPod", toFixedVersion(s[1])) :
                            (s = ua.match(/ipad[\D]*os ([\d_]+)/)) ? updateProperty("platform", "iPad", toFixedVersion(s[1])) :
                                (s = ua.match(/iphone ([\d.]+)/)) ? updateProperty("platform", "iPhone", toFixedVersion(s[1])) :
                                    (s = ua.match(/android ([\d.]+)/)) ? updateProperty("platform", "android", toFixedVersion(s[1])) : 0;
        //============================================
        //取得用户的浏览器名与版本,如果是0表示不是此浏览器
        var browser = BROWSER.browser = {
            name: "unknown",
            version: 0,
            ie: 0,
            firefox: 0,
            chrome: 0,
            opera: 0,
            safari: 0,
            mobileSafari: 0,
            adobeAir: 0 //adobe 的air内嵌浏览器
        };

        (s = ua.match(/trident.*; rv\:([\d.]+)/)) ? updateProperty("browser", "ie", toFixedVersion(s[1])) : //IE11的UA改变了没有MSIE
            (s = ua.match(/msie ([\d.]+)/)) ? updateProperty("browser", "ie", toFixedVersion(s[1])) :
                (s = ua.match(/firefox\/([\d.]+)/)) ? updateProperty("browser", "firefox", toFixedVersion(s[1])) :
                    (s = ua.match(/chrome\/([\d.]+)/)) ? updateProperty("browser", "chrome", toFixedVersion(s[1])) :
                        (s = ua.match(/opera.([\d.]+)/)) ? updateProperty("browser", "opera", toFixedVersion(s[1])) :
                            (s = ua.match(/adobeair\/([\d.]+)/)) ? updateProperty("browser", "adobeAir", toFixedVersion(s[1])) :
                                (s = ua.match(/version\/([\d.]+).*safari/)) ? updateProperty("browser", "safari", toFixedVersion(s[1])) : 0;

        //下面是各种微调
        //mobile safari 判断，可与safari字段并存
        (s = ua.match(/version\/([\d.]+).*mobile.*safari/)) ? updateProperty("browser", "mobileSafari", toFixedVersion(s[1])) : 0;

        if (platform.iPad) {
            updateProperty("browser", 'mobileSafari', '0.0');
        }

        if (browser.ie) {
            if (!document.documentMode) {
                document.documentMode = Math.floor(browser.ie);
                //http://msdn.microsoft.com/zh-cn/library/cc817574.aspx
                //IE下可以通过设置 <meta http-equiv="X-UA-Compatible" content="IE=8"/>改变渲染模式
                //一切以实际渲染效果为准
            } else if (document.documentMode !== Math.floor(browser.ie)) {
                updateProperty("browser", "ie", toFixedVersion(document.documentMode));
            }
        }
        //============================================
        //取得用户浏览器的渲染引擎名与版本,如果是0表示不是此浏览器
        BROWSER.engine = {
            name: 'unknown',
            version: 0,
            trident: 0,
            gecko: 0,
            webkit: 0,
            presto: 0
        };

        (s = ua.match(/trident\/([\d.]+)/)) ? updateProperty("engine", "trident", toFixedVersion(s[1])) :
            (s = ua.match(/gecko\/([\d.]+)/)) ? updateProperty("engine", "gecko", toFixedVersion(s[1])) :
                (s = ua.match(/applewebkit\/([\d.]+)/)) ? updateProperty("engine", "webkit", toFixedVersion(s[1])) :
                    (s = ua.match(/presto\/([\d.]+)/)) ? updateProperty("engine", "presto", toFixedVersion(s[1])) : 0;

        if (BROWSER.browser.ie) {
            if (BROWSER.browser.ie == 6) {
                updateProperty("engine", "trident", toFixedVersion("4"));
            } else if (browser.ie == 7 || browser.ie == 8) {
                updateProperty("engine", "trident", toFixedVersion("5"));
            }
        }
        return BROWSER;
    };
    // 获取浏览器对象到BROWSER
    module.getBrowser();
    //IEtest 浏览器甄别
    module.IE = function () {
        var ie = BROWSER.browser.ie;
        var ieVersion = parseInt(ie, 10);
        return ieVersion;
    };
    // 判断是否是谷歌浏览器
    module.isChrome = function () {
        return BROWSER.browser.name === "chrome";
    };
    // 判断是否是火狐浏览器
    module.isFirefox = function () {
        return BROWSER.browser.name === "firefox";
    };

    // 获取浏览器名称及其版本
    module.getBrowserEngine = function () {
        return BROWSER.engine;
    };

    module.layout = function(e){
        var cell = "";
        e?cell=e:cell=$("body");
        cell.each(function(index, element){
            var $element = $(element);
            var parentWidth, parentHeight;
            if($element.parent().is('body')){
                parentWidth=$(window).width();
                parentHeight=$(window).height();
            }else{
                var parentElement = $element.parent();
                if(parentElement.is("form")){
                    parentElement = parentElement.parent();
                }
                parentWidth=parentElement.width();
                parentHeight=parentElement.height();
            };
            for(var i = 0;i<module.UI_LAYOUT.length;i++){
                var name = module.UI_LAYOUT[i];
                if($element.hasClass(name)){
                    if(module[name.replace(/-/g, "")]){
                        module[name.replace(/-/g, "")]($element,parentWidth,parentHeight);
                    }
                };
            };
            if($element.children("div").length > 0){
                // 处理子集为DIV的对象
                $element.children("div").each(function(i, el){
                    var div = $(el);
                    if(!div.hasClass("f-hidden")){
                        module.layout(div);
                    }
                });
            }else if($element.children("iframe").length > 0){
                // IE6强制刷新
                var ieversion = module.IE();
                if(ieversion <= 8 && ieversion != 0){
                    var iframe = $element.children("iframe");
                    if(iframe[0].contentWindow&&iframe[0].contentWindow.enatool){
                        iframe[0].contentWindow.enatool.layout();
                    }
                };
            };
        });
        
    };

    //全计算
    module.glayouted = function(element,pw,ph){
        if(element[0] && element.hasClass("g-layouted")){
            element.outerWidth(pw).outerHeight(ph);
        }
        var layout = element,laytop,layleft,layright,laybottom,laycenter,laytops,laybottoms,laytopHeight,laybottomHeight;
        laytop = layout.children(".layouted-top,.layout-top");
        layleft = layout.children(".layouted-left,.layout-left");
        layright = layout.children(".layouted-right,.layout-right");
        laybottom = layout.children(".layouted-bottom,.layout-bottom");
        laycenter = layout.children(".layouted-center,.layout-center");

        if(laytop[0]){
            laytopHeight = laytop.height();
        };
        if(laybottom[0]){
            laybottomHeight = laybottom.height();
        };

        var getCenterHeight = function(){
            return ph - laytopHeight - laybottomHeight;
        }

        if(laytop[0] && laytop.hasClass("layouted-top")){
            laytop.outerWidth(pw);
        };

        if(laybottom[0] && laybottom.hasClass("layouted-bottom")){
            laybottom.outerWidth(pw);
        };

        if(layleft[0]){
            layleft.height(getCenterHeight());
            layleft.css('top',laytopHeight+'px');
        };

        if(layright[0]){
            layright.height(getCenterHeight());
            layright.css('top',laytopHeight+'px');
        };

        if(laycenter[0]){
            var layleftWidth = 0;
            var layrightWidth = 0;
            var laytopOuterHeight = 0;
            var laybottomOuterHeight = 0;
            var layleftOuterWidth = 0;
            var layrightOuterWidth = 0;

            if(layleft[0]){
                layleftWidth = layleft.width();
                layleftOuterWidth = layleft.outerWidth();
            };
            if(layright[0]){
                layrightWidth = layright.width();
                layrightOuterWidth = layright.outerWidth();
            };
            if(laytop[0]){
                laytopOuterHeight = laytop.outerHeight();
            };
            if(laybottom[0]){
                laybottomOuterHeight = laybottom.outerHeight();
            };
            if(laycenter.hasClass("layouted-center")){
                laycenter.outerWidth(pw - layleftOuterWidth - layrightOuterWidth);
                laycenter.css({'top':laytopOuterHeight+'px','left':layleftOuterWidth+'px'});
            }else if (laycenter.hasClass("layout-center")){
                if(laycenter.children(".center-content")){
                    var content = laycenter.children(".center-content");
                    content.css({
                        "margin-left":layleftOuterWidth,
                        "margin-right":layrightOuterWidth
                    })
                    content.outerHeight(ph - laytopOuterHeight - laybottomOuterHeight);
                }
                laycenter.css({'top':laytopOuterHeight+'px'});
            }
            laycenter.outerHeight(ph - laytopOuterHeight - laybottomOuterHeight);
        };

        if(laycenter.children().is('iframe')){
            var h = laycenter.height();
            //高度填充
            module.hauto(laycenter.children('iframe'));
            laycenter.css('overflow','hidden');
        };
    };

    module.glayout = function(element,pw,ph){
        if(enatool.RESIZEING == true){
            return false;
        }
        // 静态渲染 80%通过css自动渲染
        var layout = element,laytop,layleft,layright,laybottom,laycenter,laytops,laybottoms,laytopHeight,laybottomHeight;
        laytop = layout.children(".layout-top");
        layleft = layout.children(".layout-left");
        layright = layout.children(".layout-right");
        laybottom = layout.children(".layout-bottom");
        laycenter = layout.children(".layout-center");

        if(laytop[0]){
            laytopHeight = laytop.height();
        };
        if(laybottom[0]){
            laybottomHeight = laybottom.height();
        };

        var getCenterHeight = function(){
            return ph - laytopHeight - laybottomHeight;
        }

        if(layleft[0]){
            layleft.height(getCenterHeight());
            layleft.css('top',laytopHeight+'px');
        };

        if(layright[0]){
            layright.height(getCenterHeight());
            layright.css('top',laytopHeight+'px');
        };

        if(laycenter[0]){
            var layleftWidth = 0;
            var layrightWidth = 0;
            var laytopOuterHeight = 0;
            var laybottomOuterHeight = 0;
            var layleftOuterWidth = 0;
            var layrightOuterWidth = 0;

            if(layleft[0]){
                layleftWidth = layleft.width();
                layleftOuterWidth = layleft.outerWidth();
            };
            if(layright[0]){
                layrightWidth = layright.width();
                layrightOuterWidth = layright.outerWidth();
            };
            if(laytop[0]){
                laytopOuterHeight = laytop.outerHeight();
            };
            if(laybottom[0]){
                laybottomOuterHeight = laybottom.outerHeight();
            };
            if (laycenter.hasClass("layout-center")){
                if(laycenter.children(".center-content")){
                    var content = laycenter.children(".center-content");
                    content.css({
                        "margin-left":layleftOuterWidth,
                        "margin-right":layrightOuterWidth
                    })
                    content.outerHeight(ph - laytopOuterHeight - laybottomOuterHeight);
                }
                laycenter.css({'top':laytopOuterHeight+'px'});
            }
            laycenter.outerHeight(ph - laytopOuterHeight - laybottomOuterHeight);
        };

        if(laycenter.children().is('iframe')){
            var h = laycenter.height();
            //高度填充
            module.hauto(laycenter.children('iframe'));
            laycenter.css('overflow','hidden');
        };
    };

    // 获取对象填充内容宽高
    module.getInnerSize = function(element){
        var obj = {
            innerWidth:0,
            innerHeight:0
        };

        var elementParent = element.parent();
        var parenth = elementParent.innerHeight();
        if(elementParent.css("padding-top")){
            parenth -= parseInt(elementParent.css("padding-top"));
        }
        if(elementParent.css("padding-bottom")){
            parenth -= parseInt(elementParent.css("padding-bottom"));
        }
        var parentw = elementParent.innerWidth();
         if(elementParent.css("padding-left")){
            parentw -= parseInt(elementParent.css("padding-left"));
        }
        if(elementParent.css("padding-right")){
            parentw -= parseInt(elementParent.css("padding-right"));
        }

        obj.innerWidth = parentw;
        obj.innerHeight = parenth;
        return obj;
    };
    
    //动态高度填充 上下平分
    module.ghmax = function(element){
        var obj = module.getInnerSize(element);
        var parenth = obj.innerHeight;
        var parentw = obj.innerWidth;
        var hmaxn = element.siblings('.g-h-max').length + 1;
        var sibls = $(element).siblings(':not(.g-h-max)');
        var sibl = sibls.not(module.NO_SIZE);
        var siblingn = sibl.length;
        var sum = 0;
        for (var i = 0; i < siblingn; i++) {
            sum += $(sibl[i]).outerHeight();
        };
        // 求余 计算浮点数
        var yu = (parenth - sum) % hmaxn;
        var hmaxH = Math.floor((parenth - sum) / hmaxn);
        if(element.index() < yu){
            hmaxH = hmaxH + 1;
        }
        // 关于 padding  border
        element.outerHeight(hmaxH, true).outerWidth(parentw, true);
    };

    // 纯h
    module.hauto = function(element){
        var obj = module.getInnerSize(element);
        var parenth = obj.innerHeight;
        var hmaxn = element.siblings('.g-h-auto').length + 1;
        // var sibls = $(element).siblings().not('.g-h-auto');
        var sibls = $(element).siblings(':not(.g-h-auto)');
        var sibl = sibls.not(module.NO_SIZE);
        var siblingn = sibl.length;
        var sum = 0;
        for (var i = 0; i < siblingn; i++) {
            sum += $(sibl[i]).outerHeight();
        };
        // 求余 计算浮点数
        var yu = (parenth - sum) % hmaxn;
        var hmaxH = Math.floor((parenth - sum) / hmaxn);
        if(element.index() < yu){
            hmaxH = hmaxH + 1;
        }
        // 关于 padding  border
        element.outerHeight(hmaxH, true)
    };

    // 动态宽度填充
    module.wmax = function(element){
        var obj = module.getInnerSize(element);
        var parenth = obj.innerHeight;
        var parentw = obj.innerWidth;
        var wmaxn = element.siblings('.g-w-max').length + 1;
        // var sibls = $(element).siblings().not('.g-w-max');
        var sibls = $(element).siblings(':not(.g-w-max)');
        var sibl = sibls.not(module.NO_SIZE);
        var siblingn = sibl.length;
        var sum = 0;
        for (var i = 0; i < siblingn; i++) {
            sum += $(sibl[i]).outerWidth();
        };
        // 求余 计算浮点数
        var yu = (parentw - sum) % wmaxn;
        var wmaxH = Math.floor((parentw - sum) / wmaxn);
        if(element.index() < yu){
            wmaxH = wmaxH + 1;
        }
        element.outerHeight(parenth, true).outerWidth(wmaxH, true);
    }

    //纯w
    module.wauto = function(element){
        var obj = module.getInnerSize(element);
        var parentw = obj.innerWidth;
        var wmaxn = element.siblings('.g-w-auto').length + 1;
        // var sibls = $(element).siblings().not('.g-w-auto');
        var sibls = $(element).siblings(':not(.g-w-auto)');
        var sibl = sibls.not(module.NO_SIZE);
        var siblingn = sibl.length;
        var sum = 0;
        for (var i = 0; i < siblingn; i++) {
            sum += $(sibl[i]).outerWidth();
        };
        // 求余 计算浮点数
        var yu = (parentw - sum) % wmaxn;
        var wmaxH = Math.floor((parentw - sum) / wmaxn);
        if(element.index() < yu){
            wmaxH = wmaxH + 1;
        }
        element.outerWidth(wmaxH, true);
    }

    //动态处理填充尺寸溢出
    module.gmax = function(element){
        var obj = module.getInnerSize(element);
        var parenth = Math.floor(obj.innerHeight);
        var parentw = Math.floor(obj.innerWidth);
        // 考虑了边框问题
        element.outerWidth(parentw, true);
        element.outerHeight(parenth, true);
    };

    window.enatool = module;
})(window)

$(function(){
    setTimeout(function(){
        enatool.layout()
    }, enatool.SETTIME_TIME/2)

    if(!enatool.LISTENTER_RESIZE){
        return false;
    }
    var t = null;
    $(window).resize(function(e){
        if(t){
            window.clearTimeout(t);
        };
        enatool.RESIZEING = true;
        t = window.setTimeout(function(){
            t = null;
            enatool.RESIZEING = false;
            enatool.layout()
            // layouted 需要打开
            // if(enatool.IE() > 7 || enatool.IE() == 0){
            //     // 关于 收缩屏幕渲染问题
            //     enatool.RESIZEING = true;
            //     t = window.setTimeout(function(){
            //         t = null;
            //         enatool.RESIZEING = false;
            //         enatool.layout();
            //     }, enatool.SETTIME_TIME/2);
            // }else{
            //     enatool.layout()
            // };
        }, enatool.SETTIME_TIME);
    })
})
    
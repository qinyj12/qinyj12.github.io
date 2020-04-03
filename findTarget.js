let 
    ifMoved = false,
    allTargetClass,
    currentTargetClass,
    scrollTop = 0;

let loadContent = function (addAfterThis, ifOpened, articleName) {
    if (ifOpened) {
        $(document).ready(function() {
            addAfterThis.style.display = "none";
            $('<aside></aside>').insertAfter(addAfterThis).load('/content/' + articleName + '.html');
        })
    } else {
        $(document).ready(function () {
            addAfterThis.style.display = "flex";
            $("aside").remove();
        })
    }
}

var moveAni = function(element, order) {
    /* 简化写法 */
    let bodyStyle = document.body.style;
    
    return function() {
        if (order === "forward"){/* 顺序动画 */
            bodyStyle.setProperty("--fatherIniW", element.fatherboxP.width);
            bodyStyle.setProperty("--fatherIniH", element.fatherboxP.height);
            bodyStyle.setProperty("--fatherIniT", element.fatherboxP.top);
            bodyStyle.setProperty("--fatherIniL", element.fatherboxP.left);
            bodyStyle.setProperty("--fatherIniB", element.fatherboxP.bottom);
            bodyStyle.setProperty("--contboxIniT", element.contboxP.top);
            bodyStyle.setProperty("--ulContentW", element.ulContentP.width)

            /* 锁定滚动条 */
            scrollTop = window.scrollY;/* 一定要先赋值，因为要把这个值存起来，反向动画时还要用这个值 */
            document.body.style.top = -scrollTop + "px";/* 一定要写在前面，不然fixed后scrollY就是0 */
            document.body.style.position = "fixed";

            /* 初始动画——ul.content，锁死高度防止出现奇怪的问题 */
            bodyStyle.setProperty("--contentIniH", element.ulContentP.height + 30);
            element.getContent.classList.add("contentInitial");

            /* 初始动画——placeholder，变成全屏fixed √ */
            element.getPlaceholder.classList.add("placeholderIniAni");

            /* 初始动画——fatherbox，占位 √ */
            element.fatherbox.classList.add("fatherboxInitial");
            
            /* 初始动画——bgColor，变色 √ */
            element.getBgcolor.classList.add("bgcolorIniAni");

            /* 初始动画——backNav，固定 √ */
            element.getBacknav.classList.remove("backNav");
            element.getBacknav.classList.add("backnavInitial");

            /* 初始动画——imgbox √ */
            element.getImg.classList.add("imgIniAni");
            element.getImg.classList.remove("imgBox");/* 之前设置了100%，和具体的数值冲突，干脆删除 */
            
            /* 初始动画——contbox √ */
            element.getContbox.classList.add("contIniAni");
            bodyStyle.setProperty("--contboxMinH", element.windowInnerH);

            /* 读取外部html */
            loadContent(element.getSpan, true, element.getId);

        } else if (order === "reverse") {/* 倒序动画 */
            bodyStyle.setProperty("--fatherIniW", element.fatherboxP.width);
            bodyStyle.setProperty("--fatherIniH", element.fatherboxP.height);
            bodyStyle.setProperty("--fatherIniT", element.fatherboxP.top);
            bodyStyle.setProperty("--fatherIniL", element.fatherboxP.left);
            bodyStyle.setProperty("--fatherIniB", element.fatherboxP.bottom);

            /* 恢复滚动条 */
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, scrollTop);

            /* 倒序动画——imgbox √*/
            element.getImg.classList.remove("imgIniAni");
            element.getImg.classList.add("imgFinalAni");
            setTimeout(function() {
                element.getImg.classList.remove("imgFinalAni");
                element.getImg.classList.add("imgBox");
            }, 300)

            /* 倒序动画——contbox √ */
            element.getContbox.classList.remove("contIniAni");
            bodyStyle.setProperty("--contboxReverW", element.getContbox.width);
            element.getContbox.classList.add("contFinalAni");
            setTimeout(function() {
                element.getContbox.classList.remove("contFinalAni");
            }, 300)

            /* 倒序动画——backnav √ */
            element.getBacknav.classList.remove("backNbacknavInitialav");
            element.getBacknav.classList.add("backNav");

            /* 倒序动画——bgColor √ */
            element.getBgcolor.classList.remove("bgcolorIniAni");
            element.getBgcolor.classList.add("bgcolorFinalAni");
            setTimeout(function() {
                element.getBgcolor.classList.remove("bgcolorFinalAni");
            }, 300)

            /* 倒序动画——placeholder，取消全屏fixed √ */
            setTimeout(function() {
                element.getPlaceholder.classList.remove("placeholderIniAni");
            }, 300)

            /* 倒序动画——fatherbox，取消占位 √ */
            setTimeout(function() {
                element.fatherbox.classList.remove("fatherboxInitial");
            }, 300)

            /* 倒序动画——ul.content，取消锁死高度 */
            setTimeout(function() {
                element.getContent.classList.remove("contentInitial");
            }, 300)

            /* 删除外部html */
            loadContent(element.getSpan, false);
        }

    }()
}

function findTargetClass(classname) {
    /* 找到所有带classname的元素 */
    let allTargetClass = document.getElementsByClassName(classname);
    /* 遍历所有classname的元素。for会一次性执行完，用var无法保证作用域 */
    for (let i = 0; i < allTargetClass.length; i++) {
        allTargetClass[i].addEventListener("click", function() {
            funcList = {
                fatherbox: allTargetClass[i],
                getBgcolor: allTargetClass[i].getElementsByTagName("section")[0],/* bgColor */
                getPlaceholder: allTargetClass[i].getElementsByTagName("div")[0],/* placeholder */
                getBacknav: document.getElementsByTagName("nav")[1],/* backNav */
                getImg: allTargetClass[i].getElementsByTagName("img")[0],/* imgbox */
                getContbox: allTargetClass[i].getElementsByTagName("div")[1],/* contbox */
                getContent: document.getElementsByClassName("content")[0],/* ul.content */
                getSpan: allTargetClass[i].getElementsByTagName("span")[0],/* span */
                getId: allTargetClass[i].id,/* fatherbox的id */

                fatherboxP: allTargetClass[i].getBoundingClientRect(),/* fatherbox的初始装填 */
                contboxP: allTargetClass[i].getElementsByTagName("div")[1].getBoundingClientRect(),/* contbox */
                ulContentP: document.getElementsByClassName("content")[0].getBoundingClientRect(),/* ulcontent */
                windowInnerH: window.innerHeight,/* 可见视窗的高度 */
            };
            if (ifMoved === false) {
                moveAni(funcList, "forward");/* allTargetClass[i]就是我要的fatherbox */
                ifMoved = true;
            };
            if (ifMoved === true) {
                funcList.getBacknav.addEventListener("click", function() {
                    moveAni(funcList, "reverse");
                    ifMoved = false;
                })
            }
        })
    }
}

// ==UserScript==
// @name         (Slightly) Better V3rm
// @namespace    https://github.com/littlepriceonu/-Slightly-Better-V3rm
// @version      1.35
// @description  Better Styling For V3rmillion
// @author       littlepriceonu#0001
// @match        *://*.v3rmillion.net/*
// @exclude      *://*.v3rmillion.net/legal.html
// @exclude      *://*.v3rmillion.net/siterules.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v3rmillion.net
// @grant        GM_setClipboard
// @downloadURL  raw.githubusercontent.com/littlepriceonu/-Slightly-Better-V3rm/main/V1.js
// ==/UserScript==

// Todo
// Make a thing that warns the user if the script is not updated
// Add lock thing next to open button on index.php
// Make the friends button green if you have them added and make it so you can unadd them if you have them added and same thing with if you have a request out for them.

(function() {
    'use strict';

    const PopupHTML = '' + 
    '        <div id="SettingsMenu">' + 
    '            <div class="toprow">' + 
    '                <h2 style="margin-left: 10px;">Settings</h2>' + 
    '' + 
    '                <h2 style="color:black; margin-left: auto; margin-right: 10px;" id="closesettings">X</h2>' + 
    '            </div>' + 
    '    ' + 
    '            <div class="options">' + 
    '                <div class="option"> <h5>Toggle Gradients</h5> <input type="checkbox" name="Gradient" id="GradientToggle"></div>' + 
    '                <div class="option"> <h5>Inject Buddy List Button</h5> <input type="checkbox" name="BuddyButton" id="BuddyToggle"></div>' + 
    '                <div class="option"> <h5>Inject Reputation Button</h5> <input type="checkbox" name="ReputationButton" id="ReputationToggle"></div>' + 
    '                <div class="option"> <h5>Close All Sections On Homepage</h5> <input type="checkbox" name="CloseSections" id="SectionsToggle"></div>' + 
    '            </div>' + 
    '' + 
    '            <div class="settingsfooter">' + 
    '                <h2>Better V3rm</h2>' + 
    '            </div>' + 
    '        </div>' + 
    '';

    console.log(`%c(slightly) Better V3rm 
By: littlepriceonu#0001`, "background: linear-gradient(to right, #ab0000, #0f0d0d); color:#00abab")
    
    // https://stackoverflow.com/questions/48759219/access-dom-from-a-different-html-file-with-js
    function LoadWebDom(url) {
        fetch(url)
            .then((response) => response.text())
            .then((text) => {
                const otherDoc = document.implementation.createHTMLDocument().documentElement;
                otherDoc.innerHTML = text;
                window.test = otherDoc
        });
    }

    function HasFireFoxFix(query, childclass) {
        var returnArray = []

        document.querySelectorAll(query).forEach(el => {
            for (var i=0; i < el.children.length; i++) {
                if (el.children[i].className.indexOf(childclass) > -1) {
                    returnArray.push(el)
                }
            }
        })
        
        return returnArray
    }

    function WaitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // Detection for the "scanning your browser" or the bot activity message
    if (document.querySelector("body > span.msg") || document.querySelector("#challenge-form")) {
        WaitForElement("body > div#wrapper").then(()=>{start()})
    }
    else {
        start()
    }

    function getAllNonSelfPosts() {
        let ReturnPosts = []

        document.querySelectorAll(".post").forEach(post => {
            if (extractUIDfromPost(post) != uid) {
                ReturnPosts.push(post)
            }
        })

        return ReturnPosts
    }

    function extractUIDfromPost(postElement) {
        var prams = new URLSearchParams(document.querySelector("#" +postElement.id+ " > .post_author > .author_information > strong > span > a").href)
        return prams.get("uid")
    }

    function extractUsernamefromPost(postElement) {
        return document.querySelector("#" +postElement.id+ " > .post_author > .author_information > strong > span > a > span").textContent
    }

    function checkNoPerms() {
        var has = false;

        if (!document.querySelector("#content > table > tbody > tr:nth-child(2) > td")) return false;

        document.querySelector("#content > table > tbody > tr:nth-child(2) > td").childNodes.forEach(el => {
            if (el.textContent.indexOf("not have permission to access this page") > -1) has = true
        })

        return has
    }

    function start() {

        // steal the user's id from the "My Profile" link
        var param;
        const uid = -1;
        if (!checkNoPerms()) {
            var param = new URLSearchParams(document.querySelector("#panel > div.ddm_anchor > div > a:nth-child(1)").href)
            const uid = param.get('uid')
            window.uid = uid
        }

        var settingsarray = {
            enableGradients: true,
            injectBuddyButton: true,
            injectRepButton: true,
            closeAllSections: true,
        }

        if (Cookie.get("BetterV3rmSettings") != undefined) {
            settingsarray = JSON.parse(Cookie.get("BetterV3rmSettings"))
        }

        // page specific features
        // little easter egg
        if (document.location.href.indexOf("v3rmillion.net/member.php?") > -1 && !checkNoPerms()) {
            var lease, synapse, x= false
            document.querySelector("#content > table > tbody > tr > td:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(2) > td").childNodes.forEach((el) => {
                if (el.textContent.toLowerCase().indexOf("lease") > -1 || (el.textContent.toLowerCase().indexOf("leasing") > -1)) lease = true
                if (el.textContent.toLowerCase().indexOf("synapse") > -1) synapse = true
                if (el.textContent.toLowerCase().indexOf("x") > -1) x = true
            })
            if (lease && synapse && x) console.log("Yea, I lease synapse too :(")
        }

        // users browsing change
        try {
            if (document.location.href.indexOf("/forumdisplay") > -1 && !checkNoPerms()) {
                var div = document.querySelector("#content > div:nth-child(1)")
                if (div.onclick) {
                    div = document.querySelector("#content > div:nth-child(2)")
                    document.querySelector("#content > div:nth-child(2) > .smalltext").childNodes[0].remove()
                }
                else {
                    document.querySelector("#content > div:nth-child(1) > .smalltext").childNodes[0].remove()
                }
                var a = document.createElement("h1")
                a.innerText = "Users Browsing"
                a.style.marginTop = "0px"
                div.prepend(a)
                div.style.display = "flex"
                div.style.flexDirection = "column"

                // remove advertisement thing
                document.querySelector("#content > div:nth-child(1)").remove()
            } 
        } catch {
            // Dont Do Anything, isn't really a point to lmao
        }

        // replace the Direct link text with a few icons, remove the rate buttons if the post is yours
        if (document.location.href.indexOf("v3rmillion.net/showthread.php?") > -1 && !checkNoPerms()) {

            // remove the Direct Link Test and replace with a few images
            document.querySelectorAll(".post").forEach(post => {
                var link = document.createElement("img")
                link.src = "https://cdn2.iconfinder.com/data/icons/pittogrammi/142/95-512.png"
                link.style.width = "23px"
                link.style.height = "20px"
                link.style.filter = "invert(50%)"
                link.style.cursor = "pointer"
            
    
                var copy = document.createElement("img")
                copy.src = "https://cdn-icons-png.flaticon.com/512/1621/1621635.png"
                copy.style.width = "23px"
                copy.style.height = "20px"
                copy.style.filter = "invert(50%)"
                copy.style.cursor = "pointer"

                var href;
                var skip = false;

                try {
                    href = document.querySelector("#" + post.id + " > .post_head > .float_right > strong > a").href
                }
                catch {
                    console.log("better v3rm had a issue with grabbing the post link. Skipping the copy and link image placement.")
                    console.log("this is a known error and will be patching in the future (hopefully :o). Falling back to default link)")
                    skip = true;
                }

                if (!skip) {
                    copy.onclick = () => {GM_setClipboard(href)}
                    link.onclick = () => {openInNewTab(href)}
                    
                    document.querySelector("#" + post.id + " > .post_head > .float_right > strong").remove()
                    document.querySelector("#" + post.id + " > .post_head > .float_right").append(link)
                    document.querySelector("#" + post.id + " > .post_head > .float_right").prepend(copy)
                }
                else if (document.querySelector("#" + post.id + " > .post_head > .float_right > strong")) {
                    document.querySelector("#" + post.id + " > .post_head > .float_right > strong").style.paddingLeft = "5px"
                    document.querySelector("#" + post.id + " > .post_head > .float_right > strong").style.paddingRight = "8px"
                }
            })

            // remove the rate button functionality if the post is yours
            document.querySelectorAll(".post").forEach(post => {
                if (extractUIDfromPost(post) == uid) {

                    var child = document.querySelector("#" + post.id + " > .post_content > div:nth-child(4)").children

                    // Idk why I have to run it twice for it to work but I do :shrug:
                    for (let i=0; i < child.length; i++) {
                        if (child[i].style.minWidth != "") {
                            child[i].children.item(0).href = "javascript:void(0)"
                            child[i].children.item(0).onclick = null
                        }
                    }

                    for (let i=0; i < child.length; i++) {
                        if (child[i].style.minWidth != "") {
                            child[i].children.item(0).href = "javascript:void(0)"
                            child[i].children.item(0).onclick = null
                        }
                    }
                }
            })

            // add the "add friend" button that adds the user to the buddy list
            getAllNonSelfPosts().forEach(post => {
                var image = document.createElement("img")
                image.src = "https://cdn-icons-png.flaticon.com/512/2583/2583118.png"
                image.id = "BuddyButton"
                image.style.width = "23px"
                image.style.height = "20px"
                image.style.filter = "invert(50%)"
                image.style.cursor = "pointer"

                var username = extractUsernamefromPost(post)

                // the following filters are calculated by https://codepen.io/sosuke/pen/Pjoqqp
                image.onclick = () => {
                    fetch("usercp.php?action=do_editlists&add_username=" + username + "&my_post_key="+ my_post_key, { method: 'POST'}).then((res) => {
                        if (res.ok) {
                            image.style.filter = "invert(26%) sepia(77%) saturate(4352%) hue-rotate(83deg) brightness(93%) contrast(92%)"
                            setTimeout(() => {
                                image.style.filter = "invert(50%)"
                            }, 2000);
                        }
                        else {
                            image.style.filter = "invert(21%) sepia(25%) saturate(5820%) hue-rotate(339deg) brightness(106%) contrast(111%)"
                            setTimeout(() => {
                                image.style.filter = "invert(50%)"
                            }, 2000);
                        }
                    })
                }
                document.querySelector("#" + post.id + "> .post_head > .float_right").append(image)
                document.querySelector("#" + post.id + "> .post_head > .float_right").style.display = "flex"
            })

            // add reputation button
            getAllNonSelfPosts().forEach(post => {
                var image = document.createElement("img")
                image.src = "https://cdn-icons-png.flaticon.com/512/1828/1828961.png"
                image.id = "ReputationButton"
                image.style.width = "20px"
                image.style.height = "20px"
                image.style.filter = "invert(50%)"
                image.style.cursor = "pointer"
                image.style.paddingRight = "3px"

                image.onclick = () => {
                    MyBB.reputation(parseInt(extractUIDfromPost(post)))
                }

                document.querySelector("#" + post.id + "> .post_head > .float_right").prepend(image)
            })
        }

        if ((document.location.href.indexOf("v3rmillion.net/index.php") > -1 && !checkNoPerms())) {
            var skipnavigationcheck = false

            if (document.querySelector("#down_alert").style.display == "block") {
                document.querySelector(".navigation > span.active").remove()
                document.querySelector("#down_alert").style.display = "flex"
                document.querySelector("#down_alert").style.alignItems = "center"
                document.querySelector("#down_alert").style.justifyContent = "center"

                document.querySelector("#down_alert").style.textAlign = "center"
                skipnavigationcheck = true
            }

            if (!skipnavigationcheck) document.querySelector("#container > div.navigation").remove()
        }

        // code that v3rm uses to indicate what tabs are collapsed or not, this is all of them collapsed
        const closed = 'cat_34|cat_8|cat_6|boardstats|cat_17|cat_27|cat_7|cat_3|cat_34|cat_8|cat_7|cat_27|cat_17|cat_6|boardstats|cat_3'

        // make it so next time its all closed
        window.addEventListener("beforeunload", function(e){
            if (settingsarray.closeAllSections) {
                Cookie.set("collapsed", closed)
            }

            Cookie.set("BetterV3rmSettings", JSON.stringify(settingsarray))
        });

        function injectCSS(css, append) {
            let test = document.querySelector("#CustomCSS")
            if (test) {
                if (append) {
                    test.innerText = test.innerText + " " + css
                    return test
                }
                test.innerText = css
                return test
            }

            let el = document.createElement('style');
            el.innerText = css;
            el.id = "CustomCSS"


            document.head.appendChild(el);
            return el;
        }

        // stupid advertise with us
        var advert = document.querySelector("#sharingPlace")
        if (advert) advert.remove()

        // dumb links like "discord" and "upgrade"
        if (!checkNoPerms()) { 
            document.querySelector("#bridge > div > ul > li:nth-child(5) > a").remove()
            document.querySelector("#bridge > div > ul > li:nth-child(6) > a").remove()
        }

        // add the popup to the html
        var settingspopup = document.createElement("div")
        settingspopup.style.display = "none"
        settingspopup.className = "settingscontainer"
        settingspopup.id = "settingscontainer"
        settingspopup.innerHTML = PopupHTML

        document.body.append(settingspopup)

        // Add settings button at the top
        var toplinks = document.querySelector(".menu.top_links")
        var settings = document.createElement("li")
        settings.id = "better-verm-settings"

        settings.style.cursor = "pointer"
        settings.style.padding = "15px 10px 14px"

        var settingsimg = document.createElement("i")
        settingsimg.classList.add("fa")
        settingsimg.classList.add("fa-cog")

        var settingstext = document.createElement("span")
        settingstext.textContent = "Better V3rm"
        settingstext.style.paddingLeft = "5px"

        var settingsbackground = document.createElement("ul")

        settings.append(settingstext)
        settings.prepend(settingsimg)
        settings.append(settingsbackground)
        toplinks.append(settings)

        // when the "better v3rm settings" is pressed
        settings.onclick = ()=>{
            if (settingspopup.style.display == "none") {
                settingspopup.style.display = "flex"
                document.body.style.overflowY = "hidden"
            }
            else {
                settingspopup.style.display = "none"
                document.body.style.overflowY = ""
            }
        }

        // if the click is on the background
        settingspopup.addEventListener("click", (e) => {
            if (e.composedPath()[0].id != "settingscontainer") return;
            if (settingspopup.style.display == "none") return;

            settingspopup.style.display = "none"
            document.body.style.overflowY = ""
        })

        // if they pressed the x
        document.querySelector("#closesettings").onclick = () => {
            settingspopup.style.display = "none"
            document.body.style.overflowY = ""
        }

        document.querySelector("#closesettings").style.cursor = "pointer"

        var gradientToggle = document.querySelector("#GradientToggle")
        var buddyButtonToggle = document.querySelector("#BuddyToggle")
        var repButtonToggle = document.querySelector("#ReputationToggle")
        var closeSections = document.querySelector("#SectionsToggle")

        function toggleGradients(toggle) {
            if (toggle) {
                document.querySelector("#bridge").setAttribute("data-applygradient", true)
                document.querySelector("#footer").setAttribute("data-applygradient", true)
                document.querySelector("div#header").setAttribute("data-applygradient", true)
            }
            else {
                document.querySelector("#bridge").setAttribute("data-applygradient", false)
                document.querySelector("#footer").setAttribute("data-applygradient", false)
                document.querySelector("div#header").setAttribute("data-applygradient", false)        
            }
        }

        function toggleBuddyButton(toggle) {
            if (document.location.href.indexOf("v3rmillion.net/showthread.php?") == -1 || checkNoPerms()) return;

            if (toggle) {
                document.querySelector("#BuddyButton").style.display = "block"
            }
            else {
                document.querySelector("#BuddyButton").style.display = "none"
            }
        }

        function toggleReputationButton(toggle) {
            if (document.location.href.indexOf("v3rmillion.net/showthread.php?") == -1 || checkNoPerms()) return;

            if (toggle) {
                document.querySelector("#ReputationButton").style.display = "block"
            }
            else {
                document.querySelector("#ReputationButton").style.display = "none"
            }
        }

        // checks for if its enabled
        if (settingsarray.enableGradients) {
            gradientToggle.checked = true
        }

        if (settingsarray.injectBuddyButton) {
            buddyButtonToggle.checked = true
        }

        if (settingsarray.injectRepButton) {
            repButtonToggle.checked = true
        }

        if (settingsarray.closeAllSections) {
            closeSections.checked = true
        }

        toggleGradients(settingsarray.enableGradients)
        toggleBuddyButton(settingsarray.injectBuddyButton)
        toggleReputationButton(settingsarray.injectRepButton)

        gradientToggle.onclick = () => {
            settingsarray.enableGradients = gradientToggle.checked
            toggleGradients(gradientToggle.checked)
        }

        buddyButtonToggle.onclick = () => {
            settingsarray.injectBuddyButton = buddyButtonToggle.checked
            toggleBuddyButton(buddyButtonToggle.checked)
        }

        repButtonToggle.onclick = () => {
            settingsarray.injectRepButton = repButtonToggle.checked
            toggleReputationButton(repButtonToggle.checked)
        }

        closeSections.onclick = () => {
            settingsarray.closeAllSections = closeSections.checked
        }

        // weird doggo
        var peeka = document.querySelector("#peeka")
        if (peeka) peeka.remove()
        // bye bye peeka

        var redalert = document.querySelector("#content > div:nth-child(1) > div.red_alert")
        if (redalert && document.querySelector("#content > div:nth-child(1) > div.red_alert > a").innerText == "New information about ownership structure.") {
            redalert.remove()
        }

        // moving the pms and alerts button so it looks better
        if (!checkNoPerms()) {
            var PMs = document.querySelector("#panel > ul > li:nth-child(2)")
            PMs.remove()

            var alerts = document.querySelector("#panel > ul > li.alerts")
            alerts.remove()

            document.querySelector("#panel > ul").prepend(PMs)
            document.querySelector("#panel > ul").prepend(alerts)
        }

        function openInCurrentTab(url) {
            window.open(url, '_self').focus();
        }

        function openInNewTab(url) {
            window.open(url, '_blank').focus();
        }

        if (checkNoPerms()) {
            if (document.querySelector(".welcome")) {
                document.querySelector(".welcome").innerHTML = document.querySelector(".welcome").innerHTML.replace("Hello There, Guest!", "Guest, ")
            }
        }

        if (!checkNoPerms()) {
            var avatar = document.querySelector("#panel > div.user_avatar")
            var avatarimage = document.querySelector("#panel > div.user_avatar > img")

            function setUpAvatar(url) {
                avatarimage.src = url
                avatarimage.style.cursor = "pointer"
                avatarimage.onclick = () => {
                    openInCurrentTab("https://v3rmillion.net/member.php?action=profile&uid=" + uid)
                }
    
                avatar.classList.remove("hidden")   
            }

            fetch("https://v3rmillion.net/uploads/avatars/avatar_" + uid + ".gif").then((data) => {
                if (data.ok) setUpAvatar("https://v3rmillion.net/uploads/avatars/avatar_" + uid + ".gif")
            })

            fetch("https://v3rmillion.net/uploads/avatars/avatar_" + uid + ".jpg").then((data) => {
                if (data.ok) setUpAvatar("https://v3rmillion.net/uploads/avatars/avatar_" + uid + ".jpg")
            })
        
            fetch("https://v3rmillion.net/uploads/avatars/avatar_" + uid + ".png").then((data) => {
                if (data.ok) setUpAvatar("https://v3rmillion.net/uploads/avatars/avatar_" + uid + ".png")
            })
        }

        document.querySelector("#footer > ul:nth-child(1) > h2").innerText = "Important"
        document.querySelector("#footer > ul:nth-child(2) > h2").innerText = "Other Links"

        var mouseOver = false

        document.querySelectorAll(".thead div:nth-child(2) > strong").forEach(str => {
            if (str.innerText == "Board Statistics") return
            str.addEventListener("mouseover", ()=>{mouseOver = true})
            str.addEventListener("mouseleave", ()=>{mouseOver = false})
        })
 
        document.querySelectorAll(".thead > .expcolimage > img").forEach(img => {
            img.addEventListener("mouseover", ()=>{mouseOver = true})
            img.addEventListener("mouseleave", ()=>{mouseOver = false})
        })

        try {
        document.querySelectorAll(".thead:has(div.expcolimage)").forEach(thead => {
            thead.style.cursor = "pointer"
            thead.onclick = ()=>{
                for(var i=0; i < thead.children.length; i++) {
                    let el = thead.children[i]
                    if (el.className.indexOf("expcolimage") > -1) {
                        if (!mouseOver) {
                            el.childNodes[0].click()
                        }
                        break;
                    }
                }
            }
        })}
        catch {
            HasFireFoxFix(".thead", "expcolimage").forEach(thead => {
                thead.style.cursor = "pointer"
                thead.onclick = ()=>{
                    for(var i=0; i < thead.children.length; i++) {
                        let el = thead.children[i]
                        if (el.className.indexOf("expcolimage") > -1) {
                            if (!mouseOver) {
                                el.childNodes[0].click()
                            }
                            break;
                        }
                    }
                }
            })
        }

        // CSS stuff from here

        // add the cool black to red gradient line
        injectCSS('#bridge[data-applygradient=true] { border-bottom: 5px solid; border-image-slice: 1; border-image-source: linear-gradient(to left, #ab0000, #0f0d0d); }', true);

        // add the cool red to black gradient line
        injectCSS('#footer[data-applygradient=true] {border-top: 5px solid; border-image-slice: 1; border-image-source: linear-gradient(to right, #ab0000, #0f0d0d);}', true)

        // add the user avatar back and make it look good
        injectCSS('.user_avatar { border:none !important; margin-right:7px; margin-left:3px; }', true);

        // center copyright
        injectCSS('#copyright {text-align:center;}', true)

        // make the text of the links at the bottom be centered, make it so they touch the bottom of the footer
        injectCSS("ul.bottommenu {text-align:center; padding-bottom: 67px !important;}", true)

        // gradient back animation
        injectCSS('@keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }', true)

        // these are just colors I was testing for the gradient, the bottom is the best one.
        // #ab0000, #0c0f45, #2f004f, #0f0d0d
        // #0c0f45, #ab0000, #0f0d0d, 2f004f

        // gradient back
        injectCSS('div#header[data-applygradient=true] { background: linear-gradient(to right, #ab0000, #0c0f45, #2f004f, #0f0d0d); background-size: 400% 400%; animation: gradient 15s ease infinite;}', true)

        // no rounded edges on those red things (at the top of it)
        injectCSS('.thead {border-top-left-radius: 0; border-top-right-radius: 0;}', true)

        // center forum text
        injectCSS('.thead > div:not(.expcolimage) {display:flex; justify-content:center;}', true)

        // make the no alerts text look better
        injectCSS(".alert-row__no-alerts {display:flex; justify-content:center; padding-top: 10px; padding-bottom: 10px;}", true)

        // black scroll bar
        injectCSS("body::-webkit-scrollbar { width: 16px; height: 16px;} body::-webkit-scrollbar-track { background-color: transparent !important; }  body::-webkit-scrollbar-thumb { background-color: #262323 !important; } body::-webkit-scrollbar-thumb:hover { background-color: #4f4e4e !important; }        ", true)

        injectCSS("a.button.closed_button { text-align:center !important;}", true)

        // no bottom rounded (no work)
        //injectCSS('.tborder tbody tr:last-child>td:first-child {border-bottom-right-radius: 0;}', true)
        //injectCSS('.tborder tbody tr:last-child>td:first-child {border-bottom-left-radius: 0;}', true)

        // settings menu stuff
        injectCSS(".settingscontainer {background: radial-gradient(black, transparent);color:white; position:absolute; left:0; top:0; width:100%; height: 100vh; display:flex; justify-content:center; align-items:center; z-index:999;}", true)
        injectCSS("#SettingsMenu { width:40%; height: 60%; background: rgba(0,0,0,1)}", true)

        injectCSS(".options {width:100%; height: 90%; background-color:rgb(16,16,16); display:flex; flex-direction: column; column-count: 3; justify-content: center; align-items:center;}", true)
        injectCSS(".options > * > h5 {margin:unset;}", true)

        injectCSS(".toprow { background:#cd1818; position:relative; top: 0px; display: flex; flex-direction:row; align-items: center; justify-content: center; padding-top: 5px; padding-bottom: 5px}", true)
        injectCSS(".toprow > h2 {margin:unset; float:left;}", true)

        injectCSS(".settingsfooter { background:#cd1818; position:relative; top: 0px; display: flex; align-items: center; justify-content: center; padding-top: 5px; padding-bottom: 5px; border-bottom-right-radius:5px; border-bottom-left-radius: 5px; }", true)
        injectCSS(".settingsfooter > h2 {margin:unset;}", true)

        injectCSS(".option { display:flex; justify-content:center; align-items: center; flex-direction: row; margin-top:5px}", true)

        injectCSS(".option > input[type='checkbox'] {margin:unset; margin-left:5px;}", true)
    }
})();
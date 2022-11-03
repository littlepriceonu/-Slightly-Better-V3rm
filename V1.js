// ==UserScript==
// @name         (Slightly) Better V3rm
// @namespace    https://github.com/littlepriceonu/-Slightly-Better-V3rm
// @version      1.11
// @description  Better Styling For V3rmillion
// @author       littlepriceonu#0001
// @match        *://*.v3rmillion.net/*
// @exclude      *://*.v3rmillion.net/legal.html
// @exclude      *://*.v3rmillion.net/siterules.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v3rmillion.net
// @grant        none
// @updateURL    raw.githubusercontent.com/littlepriceonu/-Slightly-Better-V3rm/main/V1.js
// @downloadURL  raw.githubusercontent.com/littlepriceonu/-Slightly-Better-V3rm/main/V1.js
// ==/UserScript==

(function() {
    'use strict';

    // steal the user's id from the "My Profile" link
    var param = new URLSearchParams(document.querySelector("#panel > div.ddm_anchor > div > a:nth-child(1)").href)
    var uid = param.get('uid')

    console.log(`%c(slightly) Better V3rm 
By: littlepriceonu#0001`, "background: linear-gradient(to right, #ab0000, #0f0d0d); color:#00abab")
    
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

    function checkNoPerms() {
        var has = false;

        if (!document.querySelector("#content > table > tbody > tr:nth-child(2) > td")) return false;

        document.querySelector("#content > table > tbody > tr:nth-child(2) > td").childNodes.forEach(el => {
            if (el.textContent.indexOf("not have permission to access this page") > -1) has = true
        })

        return has
    }

    function start() {
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
                div.prepend(a)
                div.style.display = "flex"
                div.style.flexDirection = "column"
            } 
        } catch {
            // Dont Do Anything, isn't really a point to lmao
        }

        // code that v3rm uses to indicate what tabs are collapsed or not, this is all of them collapsed
        const closed = 'cat_34|cat_8|cat_6|boardstats|cat_17|cat_27|cat_7|cat_3'

        // make it so next time its all closed
        window.addEventListener("beforeunload", function(e){
           setCookie("collapsed", closed, 365)
        }, false);

        const injectCSS = (css, append) => {
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
        };

        function setCookie(cname, cvalue, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        // V3rmillion text
        document.querySelector("#container > div.navigation").remove()

        // stupid advertise with us
        var advert = document.querySelector("#sharingPlace")
        if (advert) advert.remove()

        // dumb links like "discord" and "upgrade"
        document.querySelector("#bridge > div > ul > li:nth-child(5) > a").remove()
        document.querySelector("#bridge > div > ul > li:nth-child(6) > a").remove()

         // weird doggo
        var peeka = document.querySelector("#peeka")
        if (peeka) peeka.remove()
        // bye bye peeka

        var redalert = document.querySelector("#content > div:nth-child(1) > div.red_alert")
        if (redalert && document.querySelector("#content > div:nth-child(1) > div.red_alert > a").innerText == "New information about ownership structure.") {
            redalert.remove()
        }

        // moving the pms and alerts button so it looks better
        var PMs = document.querySelector("#panel > ul > li:nth-child(2)")
        PMs.remove()

        var alerts = document.querySelector("#panel > ul > li.alerts")
        alerts.remove()

        document.querySelector("#panel > ul").prepend(PMs)
        document.querySelector("#panel > ul").prepend(alerts)

        function openInCurrentTab(url) {
            window.open(url, '_self').focus();
        }

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

        document.querySelector("#footer > ul:nth-child(1) > h2").innerText = "Important"
        document.querySelector("#footer > ul:nth-child(2) > h2").innerText = "Other Links"

        var mouseOver = false

        document.querySelectorAll(".thead div:nth-child(2) > strong").forEach(str => {
            if (str.innerText == "Board Statistics") return
            str.addEventListener("mouseover", ()=>{mouseOver = true})
            str.addEventListener("mouseleave", ()=>{mouseOver = false})
        })
 
        document.querySelectorAll("td.thead > .expcolimage > img").forEach(img => {
            img.addEventListener("mouseover", ()=>{mouseOver = true})
            img.addEventListener("mouseleave", ()=>{mouseOver = false})
        })

        document.querySelectorAll("td.thead.thead_collapsed").forEach(thead => {
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

        // CSS stuff from here

        // add the cool black to red gradient line
        injectCSS('#bridge { border-bottom: 5px solid; border-image-slice: 1; border-image-source: linear-gradient(to left, #ab0000, #0f0d0d); }', true);

        // add the cool red to black gradient line
        injectCSS('#footer {border-top: 5px solid; border-image-slice: 1; border-image-source: linear-gradient(to right, #ab0000, #0f0d0d);}', true)

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
        injectCSS('div#header { background: linear-gradient(to right, #ab0000, #0c0f45, #2f004f, #0f0d0d); background-size: 400% 400%; animation: gradient 15s ease infinite;}', true)

        // no rounded edges on those red things (at the top of it)
        injectCSS('.thead {border-top-left-radius: 0; border-top-right-radius: 0;}', true)

        // center forum text
        injectCSS('.thead > div:not(.expcolimage) {display:flex; justify-content:center;}', true)

        // make the no alerts text look better
        injectCSS(".alert-row__no-alerts {display:flex; justify-content:center; padding-top: 10px; padding-bottom: 10px;}", true)

        // black scroll bar
        injectCSS("body::-webkit-scrollbar { width: 16px; height: 16px;} body::-webkit-scrollbar-track { background-color: transparent !important; }  body::-webkit-scrollbar-thumb { background-color: #262323 !important; } body::-webkit-scrollbar-thumb:hover { background-color: #4f4e4e !important; }        ", true)

        // no bottom rounded (no work)
        //injectCSS('.tborder tbody tr:last-child>td:first-child {border-bottom-right-radius: 0;}', true)
        //injectCSS('.tborder tbody tr:last-child>td:first-child {border-bottom-left-radius: 0;}', true)
    }
})();
'use strict';

chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'connect.data.com'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.commands.onCommand.addListener(function(command) {
    //console.log('Command:', command);
    console.log('Clipboard Content:' + getClipboardContent());
});


function getClipboardContent() {
    let bg = chrome.extension.getBackgroundPage();        // get the background page
    bg.document.body.innerHTML = "";                   // clear the background page

    // add a DIV, contentEditable=true, to accept the paste action
    var helperdiv = bg.document.createElement("div");
    document.body.appendChild(helperdiv);
    helperdiv.contentEditable = true;

    // focus the helper div's content
    var range = document.createRange();
    range.selectNode(helperdiv);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    helperdiv.focus();

    // trigger the paste action
    bg.document.execCommand("Paste");

    // read the clipboard contents from the helperdiv

    try {
        var dname = helperdiv.innerText;
        var res = dname.split(",");
        var fname = res[1].slice(1) + " " + res[0];

    }catch (e) {
        console.log(e.message);
        return;
    }
    copytext(fname);
    createNotification(fname,dname);
    // Rahman, Tanvir
    return fname;
}

function copytext(text) {
    let textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    //textField.remove();
    document.body.removeChild(textField);
}

function createNotification(finalName, firstName) {
    let opt = {
        type: "basic",
        title: finalName,
        message: firstName,
        contextMessage:"Name Rearranged",
        iconUrl: "images/re_96.png"
    };
    chrome.notifications.create(null, opt);
}
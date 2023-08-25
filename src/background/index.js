/*global chrome,browser*/
// If your extension doesn't need a background script, just leave this file empty
import axios from 'axios'
import xml2js from 'xml2js'

chrome.storage.local.get(['storage'], (result) => {
  if (result.storage && result.storage.gmail) {
    taskInBackground()
  } else {
    chrome.browserAction.setBadgeText({ text: '' })
  }
})

setInterval(function () {
  chrome.storage.local.get(['storage'], (result) => {
    if (result.storage && result.storage.gmail) {
      taskInBackground()
    } else {
      chrome.browserAction.setBadgeText({ text: '' })
    }
  })
}, 10 * 1000)

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
export function taskInBackground() {
  axios
    .get('https://mail.google.com/mail/u/1/feed/atom')
    .then(function (response) {
      const xml = response.data
      xml2js.parseString(xml, (err, apiResponse) => {
        if (err) {
          throw err
        }
        chrome.browserAction.setBadgeBackgroundColor({ color: '#005282' })

        let count = 0
        chrome.storage.local.get(['readTime'], (result) => {
          let lastReadTime = new Date(result.readTime)

          if (apiResponse.feed.entry) {
            for (let i = 0; i < apiResponse.feed.entry.length; i++) {
              let mDate = new Date(apiResponse.feed.entry[i].modified[0])
              if (mDate > lastReadTime) {
                count++
                console.log("count++", count)
                const email = apiResponse.feed.entry[i].author[0].email
                console.log("email", email[0])
                const domain = email[0].split("@")[1] || ''
                console.log("domain", domain)

                chrome.storage.local.get(['storage'], (result) => {
                  console.log("domain in", domain)
                  console.log("result of doamin", result.storage.domain)
                  if (domain == result.storage.domain) {
                    chrome.tabs.onActivated.addListener(function (activeInfo) {
                      // Get the tab id from the activeInfo object
                      var tabId = activeInfo.tabId;

                      // Use the tabId as needed
                      console.log("Current tab id: " + tabId);
                    });
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                      console.log("tabs", tabs)
                      chrome.tabs.sendMessage(tabs[0].id, { message: "New Email is received!" });
                    });
                  }
                })
              }
            }
            chrome.browserAction.setBadgeText({
              text: count === '0' ? '' : count >= 20 ? '20+' : count.toString(),
            })
          }
        })
        let isGmailLogedIn = true
        chrome.storage.local.set({ isGmailLogedIn }, function () { })
      })
    })
    .catch(function (error) {
      if (error.status === 401) {
        chrome.storage.local.get(['storage'], (result) => {
          let isGmailLogedIn = false
          chrome.storage.local.set({ isGmailLogedIn }, function () { })
        })

        chrome.browserAction.setBadgeBackgroundColor({ color: 'red' })
        chrome.browserAction.setBadgeText({
          text: '!',
        })
      }
    })
}

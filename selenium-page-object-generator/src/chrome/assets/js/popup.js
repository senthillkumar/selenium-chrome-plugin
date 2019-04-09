var MIME_TYPE = 'text/plain';
window.URL = window.URL || window.webkitURL;

function download(element, fileName, content) {
    // revoke previous download path
    window.URL.revokeObjectURL(element.href);
    element.href = window.URL.createObjectURL(new Blob([content],
        { type: MIME_TYPE }));
    chrome.downloads.download({
        filename: fileName,
        url: element.href
    });
}

function getElements() {
    return {
        button: $('button.generate'),
        downloader: $('a.downloader').get(0),
        model: {
            name: $('[id="model.name"]'),
            target: $('[id="model.target"]')
        },
        target: $('#target'),
        version: $('span.version')
    };
}

function processActivePage(input) {
    return $.Deferred(function (defer) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { input: input }, defer.resolve);
        });
    }).promise();
}

function validate(element) {
    var valid = false;

    if (element) {
        var parentNode = element.parent().removeClass();

        if (element.val() === '') {
            parentNode.addClass('error');
        }
        else {
            valid = true;
        }
    }

    return valid;
}

$(document).ready(function () {
    // Standard Google Universal Analytics code
    (function (i, s, o, g, r, a, m) {
    i.GoogleAnalyticsObject = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m);
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-325170-7', 'auto');
    // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    ga('set', 'checkProtocolTask', null);
    ga('send', 'pageview', '/popup.html');

    var elements = getElements();
    var notify = elements.button.notify();
    var preloader = $('.preloader').preloader();
    var storage = {};




    elements.target.change(function (e) {
        e.preventDefault();
        ga('send', 'event', 'popup.target', 'change', $(this).val());
    });

    chrome.storage.sync.get(["info"], function (result) {

        for (i = 0; i < result.info.length; i++) {

            $(".sample").append("<li><label for='modelname" + i + "'>" + result.info[i].key + "</label><select  id='modelname" + i + "'>");

            for (var j = 0; j < result.info[i].value.length; j++) {

                $("#modelname" + i).append("<option value='" + j + "'>" + result.info[i].value[j].strict_locator + "</option>");
            }

            $(".sample").append("</select></li>");


        }
    });


    elements.version.text('ver. ' + chrome.app.getDetails().version);

    common.getStorage().always(function (data) {
        storage = data;

        for (var key in storage.targets) {
            elements.target.append('<option value="' + key + '">' +
                storage.targets[key].label + '</option>');
        }

        elements.target.val(storage.target);
        elements.model.name.val(storage.model.name);
        elements.model.target.val(storage.model.target);

        // if it's still empty, let's show the reminder
        validate(elements.model.name);
    });

    elements.button.click(function (e) {

        storage.target = elements.target.val();
        storage.model.name = elements.model.name.val().replace(/\s+/g, '');
        storage.model.target = elements.model.target.val();
        storage.timestamp = new Date().valueOf();

        var finaldata = [];



        chrome.storage.sync.get(["info"], function (result) {


            for (let i = 0; i < result.info.length; i++) {

                var locator_temp = result.info[i].value[$("#modelname" + i).val()].locator;
                var mod_locator = Object.keys(locator_temp)[0]+"="+locator_temp[Object.keys(locator_temp)[0]];
                var resulting = {
                    name: result.info[i].key,
                    class: result.info[i].value[$("#modelname" + i).val()].class, //TO-DO

                    locator: mod_locator,
                    frameName: result.info[i].value[$("#modelname" + i).val()].frameName

                };

                finaldata.push(resulting);
                console.log(JSON.stringify(resulting));

            }

            var context = {
                title: storage.model.name,
                locators: finaldata
            };

            var target = storage.targets[storage.target];

            var generated = (Handlebars.compile(target.template))(context);


            var fileName = storage.model.name + '.' + "json";

            download(elements.downloader, fileName, generated);

            notify.success(fileName + ' is saved.');
        });
    });
});

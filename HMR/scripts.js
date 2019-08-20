(function () {
    var doms = {
        name_div: document.querySelector('#name'),
        age_div: document.querySelector('#age')
    }
    window.handleData = function ({ field, value }) {
        doms[`${field}_div`].innerHTML = value
    }

    window.changeAge = function (data) {
        console.log('in change', data)
        window.store.age = data.msg
    }
    
    function subscribe(url, callback) {
        var source = new window.EventSource(url);

        source.onmessage = function (e) {
            callback(e.data);
        };

        source.onerror = function (e) {
            if (source.readyState == window.EventSource.CLOSED) return;

            console.log('sse error', e);
        };

        return source.close.bind(source);
    };
    var button = document.querySelector('#button')
    button.addEventListener('click', function () {
        handleData({
            field:'name',
            value: '30, 不是初始值了'
        })
    })
   
    function jsonp(url) {
        var frame = document.createElement('script');
        frame.src = url;
        document.querySelector('body').append(frame);
    }
    subscribe('/eventstream', function (data) {
        if (data && /reload/.test(data)) {
            // window.location.reload();
            console.log('内容更新发送jsop')
            jsonp('/js?callback=changeAge')
        }
    });
    
}());
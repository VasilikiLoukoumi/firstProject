document.getElementById('todos').onkeypress = function (e) {

    var item = this.value;
    if (e.charCode === 13 && item != '') {
        console.log(e)
    }

}



var Module = (function () {
    function _privateMethod() {
        var array1 = Array(
            { name: 'Todos 1', checked: false },
            { name: 'Todos 2', checked: false },
            { name: 'Todos 3', checked: true },
            { name: 'One more', checked: true }
        );
        return {
            items: array1
        }

    }
    function publicMethod() {
        var ul = document.getElementById("list");
        var deleted = document.getElementById("deleted");
        var items = _privateMethod().items;

        for (i = 0; i < items.length; i++) {
            var li = document.createElement("li");
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = items[i].checked;
            li.className = 'mylist';

            li.appendChild(cb);
            li.appendChild(document.createTextNode(items[i].name));
            ul.appendChild(li);

            if (items[i].checked === true){
                var del_item = document.createElement("li");
                var del_btn = document.createElement('input');
                del_btn.type = 'button';

                
                del_item.appendChild(document.createTextNode(items[i].name));
                del_item.appendChild(del_btn);
                deleted.appendChild(del_item);
            }
        }


    }
    return {
        getItems: publicMethod,
    }
})();

Module.getItems()


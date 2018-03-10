document.getElementById('todos').onkeypress = function (e) {

    var item = this.value;
    if (e.charCode === 13 && item != '') { Module.addItem()}

}

document.getElementById('done-button').onclick = function (e) {

    Module.markalldone()

}

var Module = (function () {

    var array1 = Array(
            { name: 'Todos 1', checked: false },
            { name: 'Todos 2', checked: false },
            { name: 'Todos 3', checked: true },
            { name: 'One more', checked: true }
        );
    
    function changestate(e){ 
        var el = e.nextSibling.innerText;
        var checked = e.checked;
        if (checked === true){
            var obj = array1.find((obj, i) => {
               
                if (obj.name == el) {
                    array1[i].checked = true;
                    return true; // stop searching
                }

            });
           publicMethod()
        }
    }

    function markalldone(){
        var obj = array1.find((obj, i) => {
            array1[i].checked = true;
        });
       publicMethod()
    }

    function removeItem(e){
        
        var el = e.previousSibling.innerText;
      
        var obj = array1.find((obj, i) => {
            if (obj.name == el) {
                var idx = array1.indexOf(i);
                array1.splice(i,1);
                return true; // stop searching
            }

        });
        publicMethod()
        

    }
        
    function publicMethod() {
        document.getElementById("list").innerHTML = "";
        document.getElementById("deleted").innerHTML = "";
        
        var ul = document.getElementById("list");
        var deleted = document.getElementById("deleted");
        var items = array1;
        for (i = 0; i < items.length; i++) {
            var li = document.createElement("li");
            var cb = document.createElement('input');
            var span = document.createElement('span');

            if (items[i].checked === true){
                var del_item = document.createElement("li");
                var del_btn = document.createElement('button');
                var del_span = document.createElement('span');
                var del_btn_span = document.createElement('span');
                del_span.innerHTML = items[i].name;
                del_btn.type = 'button';
                del_btn.className = 'btn btn-default float_right';
                del_btn.onclick = function() { return removeItem(this) };
                del_item.className = 'mylist_deleted';
                del_btn_span.className = 'glyphicon glyphicon-trash';

                
                del_item.appendChild(del_span);
                del_item.appendChild(del_btn);
                del_btn.appendChild(del_btn_span);
                deleted.appendChild(del_item);
            } else {
                cb.type = 'checkbox';
                cb.checked = items[i].checked;
                cb.className = 'todo_items'
                cb.onchange = function() { return changestate(this) };
                li.className = 'mylist';
                span.innerHTML = items[i].name;
    
                li.appendChild(cb);
                li.appendChild(span);
                ul.appendChild(li);
            }

        }
        updateItemsLeft()
    }

    function addItemMethod() {
        var item_new = document.getElementById('todos').value;
        if (item_new != ''){
            var itemadd = {
                name: item_new,
                checked: false
            }
            array1.push(itemadd);
	    localStorage.setItem('notes', JSON.stringify(array1));
        }
        
        publicMethod()
    }
    

    function updateItemsLeft(){

        var cnt = 0;
        for(var i = 0; i < array1.length; ++i)
        {
            if(!array1[i].checked) 
            {
                cnt++;
            }
        }
        document.getElementById('items-left').innerHTML = cnt;

    }


    return {
        getItems: publicMethod,
        addItem: addItemMethod,
        updateItemsLeft: updateItemsLeft,
        markalldone: markalldone
    }
})();

Module.getItems()
Module.updateItemsLeft()


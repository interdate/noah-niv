
if ($('.chosen-container').length > 0) {
    $('.chosen-container').on('touchstart', function(e){
        e.stopPropagation(); e.preventDefault();
        // Trigger the mousedown event.
        $(this).trigger('mousedown');
    });
}

function setChoosen(selector,options) {
    $(document).ready(function () {
        //alert(selector);
        $(selector).chosen(options);
    });

}

function setSelect2(selector,options) {
    $(document).ready(function () {
        var select2 = $(selector).select2(options);
        /*{
         placeholder: "Select a state"
         }*/
        $(selector).on('select2:opening', function (e) {
            // Do something
            $('.bg-all').show();

        }).on('select2:close', function (e) {
            $('.bg-all').hide();
        });

        $('.bg-all').click(function(){select2.select2("close");});
        
    });

}

    $(document).ready(function (){

        $("#city").jeoCityAutoComplete();

        $("#country").jeoCountrySelect({
            callback: function ()
            {
                $("#country").removeAttr('disabled');
            }
        });
    });
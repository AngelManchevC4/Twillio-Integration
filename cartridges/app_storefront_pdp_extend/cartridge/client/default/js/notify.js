
$(document).ready(function () {
    var $phoneInput = $("#phoneNumberInput");
    var $customerPhone = $("#customerPhone");

    var $errorAlert = $("#errorAlert");
    var $successAlert = $("#successAlert");

    var $phoneForm = $("#phoneForm");

    var phoneRegex = /^\+359\d{9}$/;

    $successAlert.addClass('d-none');
    $errorAlert.addClass('d-none');

    $phoneForm.submit(function (e) {
        e.preventDefault();

        var formData = $phoneForm.serialize();

        $successAlert.removeClass("d-none");

        $.ajax({
            type: "POST",
            url: $phoneForm.attr("action"),
            data: formData,
            dataType: "text",
            success: function () {
                $successAlert.addClass('d-none');
                $errorAlert.addClass('d-none');
            },
            error: function (err) {
                $successAlert.addClass('d-none');
                $errorAlert.removeClass('d-none');
            }
        })
    })


    if (phoneRegex.test($customerPhone.val())) {
        $phoneInput.val($customerPhone.val());
    } else {
        $phoneInput.val('');
    }

})



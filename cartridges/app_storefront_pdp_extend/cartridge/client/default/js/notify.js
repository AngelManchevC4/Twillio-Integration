
$(document).ready(function () {

    var $productID = $("#productID").val();

    var $csrf = $("#csrfToken").val();

    var $phoneInput = $("#phoneNumberInput");
    var $customerPhone = $("#customerPhone");
    var $formButton = $("#formButton");

    var $errorAlert = $("#errorAlert");
    var $successAlert = $("#successAlert");

    var $phoneForm = $("#phoneForm");
    var $addToCartButton = $("#addToCartButton");

    var phoneRegex = /^\+359\d{9}$/;

    $errorAlert.css("display", "none");
    $successAlert.css("display", "none");

    // $phoneForm.addClass('d-none')
    // $addToCartButton.addClass('d-block')


    $phoneInput.on("input", function (e) {

        if (!phoneRegex.test(e.target.value)) {
            $phoneInput.addClass("is-invalid");
            $errorAlert.css("display", "block");
        } else {
            $phoneInput.removeClass("is-invalid");
            $errorAlert.css("display", "none");
        }
    })

    $phoneForm.submit(function (e) {
        e.preventDefault();

        var formData = $phoneForm.serialize();

        $successAlert.css("display", "block");

        $.ajax({
            type: "POST",
            url: $phoneForm.attr("action"),
            data: formData,
            dataType: "text",
            success: function () {
                console.log("Success");
                $successAlert.css("display", "none");
                $errorAlert.css("display", "none")
            },
            error: function (err) {
                console.log("Error");
                $successAlert.css("display", "none");
                $errorAlert.css("display", "block")
            }
        })
    })


    if (phoneRegex.test($customerPhone.val())) {
        $phoneInput.val($customerPhone.val());
    } else {
        $phoneInput.val('');
    }

})



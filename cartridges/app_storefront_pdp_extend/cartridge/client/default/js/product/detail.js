var base = require("base/product/detail");

function triggerChange(product, $productContainer) {
    if (product.available) {
        $productContainer.find("#addToCartButton").removeClass('d-none')
        $productContainer.find("#phoneForm").addClass('d-none')
    } else {
        $productContainer.find("#addToCartButton").addClass('d-none')
        $productContainer.find("#phoneForm").removeClass('d-none');
    }
}

base.updateAvailability = function () {
    $('body').on('product:updateAvailability', function (e, response) {
        $('div.availability', response.$productContainer)
            .data('ready-to-order', response.product.readyToOrder)
            .data('available', response.product.available);

        $('.availability-msg', response.$productContainer)
            .empty().html(response.message);

        if ($('.global-availability').length) {
            var allAvailable = $('.product-availability').toArray()
                .every(function (item) { return $(item).data('available'); });

            var allReady = $('.product-availability').toArray()
                .every(function (item) { return $(item).data('ready-to-order'); });

            $('.global-availability')
                .data('ready-to-order', allReady)
                .data('available', allAvailable);

            $('.global-availability .availability-msg').empty()
                .html(allReady ? response.message : response.resources.info_selectforstock);
        }

        triggerChange(response.product, response.$productContainer);
    });

}

base.updateAttribute = function () {
    $("body").on('product:afterAttributeSelect', function (e, response) {

        if ($('.product-detail>.bundle-items').length) {
            response.container.data('pid', response.data.product.id);
            response.container.find('.product-id').text(response.data.product.id);
        } else if ($('.product-set-detail').eq(0)) {
            response.container.data('pid', response.data.product.id);
            response.container.find('.product-id').text(response.data.product.id);
        } else {
            $('.product-id').text(response.data.product.id);
            $('.product-detail:not(".bundle-item")').data('pid', response.data.product.id);
        }

        $("#phoneForm").val(response.data.product.id);

    })
}

base.notify = function () {

    $(document).ready(function () {
        
        $("#successAlert").addClass("d-none");
        $("#errorAlert").addClass("d-none");

        $("#phoneForm").submit(function (e) {
            e.preventDefault();

            var formData = $("#phoneForm").serialize();

            $("#successAlert").removeClass("d-none");

            $.spinner().start();

            $.ajax({
                type: "POST",
                url: $("#phoneForm").attr("action"),
                data: formData,
                dataType: "text",
                success: function () {
                    $('body').trigger('form:success', this);
                    $.spinner().stop()
                },
                error: function () {
                    $('body').trigger('form:error', this);
                    $.spinner().stop()
                }
            })
        })
    })

    $("body").on('form:success', function (e, response) {
        $("#successAlert").addClass('d-none');
        $("#errorAlert").addClass('d-none');
    })
    $("body").on('form:error', function (e, response) {
        $("#successAlert").addClass('d-none');
        $("#errorAlert").removeClass('d-none');
    })

}

module.exports = base;
$(document).ready(function () {
    $('#card_box').on('click', '.card', function () {
        let i = this.id
        $('#popup_iframe').attr('src', '/popup/' + i);
        $('html, body').css({
            'overflow': 'hidden'
        });
        $('#popup').fadeIn(200);
        $('.popup').scrollTop(0);
    })

    $('#page').on('click', '.page_num', function () {
        $('#page .page_num').not(this).css("font-weight", "normal");
        $(this).css("font-weight", "bold");

        let page_num = parseInt(this.text)
        let index_num1 = 'index' + ((page_num - 1) * 5 + 1)
        let index_num2 = 'index' + ((page_num - 1) * 5 + 2)
        let index_num3 = 'index' + ((page_num - 1) * 5 + 3)
        let index_num4 = 'index' + ((page_num - 1) * 5 + 4)
        let index_num5 = 'index' + ((page_num - 1) * 5 + 5)

        $('#card_box').find('.col').hide()
        $('#card_box').find('.' + index_num1).show()
        $('#card_box').find('.' + index_num2).show()
        $('#card_box').find('.' + index_num3).show()
        $('#card_box').find('.' + index_num4).show()
        $('#card_box').find('.' + index_num5).show()
    })
})
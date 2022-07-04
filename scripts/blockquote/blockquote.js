$(document).ready(function() {
   if ($('blockquote').length) {
        $('blockquote').each(function (index) {
            if ($(this).text().length <= 140) {
                $(this).attr("class", "qc-blockquote--grand")
            }
            if ($(this).find("p").attr("lang")) {
                var blockquoteLang = $(this).find("p").attr("lang");
                $(this).addClass('lang-' + blockquoteLang);
            }
            // Nom de la source
            var nextAllBlockquote = $(this).nextAll("p");
            nextAllBlockquote.each(function () {
                if ($(this).find("br").length > 0) {
                    var strSource = $(this).html();
                    var strAuteur = strSource.slice(0, strSource.indexOf("<br>"));
                    var strTitre = strSource.slice(strSource.indexOf("<br>") + 4);
                    $(this).html(strAuteur + "<span>" + strTitre + "</span>");
                }
            });
        });
    }
});
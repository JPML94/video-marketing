$(function() {
  $.getJSON('/data', function(data) {
    var $dataContainer = $('#data-container');

    if (data.error) {
      $dataContainer.html('Error! ' + data.error);
      return;
    }

    $dataContainer.html('');

    data.records.forEach(function(record) {
      var $galleryCard = $('<div class="galerry-card" />');
      if (record.picture[0]) {
        $('<img />').attr('src', record.picture[0].url).appendTo($galleryCard);
      }
      var $label = $('<strong />').text(record.name);
      $galleryCard.append($label);
      $dataContainer.append($galleryCard);
    });
  });
});

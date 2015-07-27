/**
 * Creates a bootstrap pagination in the supplied div.<br/>
 * options: {
 *   div -> the jquery div,
 *   offset
 *   limit
 *   total
 *   maxPages
 *   onClick -> function called for every page clicked, receives 2 parameters:
 *   			e -> the on click event
 *   			page -> the current page: {offset: int, li: jquery obj, enabled: boolean}
 * }
 */

function pager() { }

pager.gen = function (opts) {
    var $pagDiv = opts.div,
        offset = opts.offset,
        limit = opts.limit,
        total = opts.total,
        maxPages = opts.maxPages || 5,
        onClick = opts.onClick;
    if ((typeof offset) === 'undefined' || !limit || !total) {
        $pagDiv.hide();
        return null;
    } else {
        $pagDiv.show();
    }
    maxPages = Math.min(maxPages, Math.floor((total - 1) / limit) + 1);

    var result = [];

    $pagDiv.html('');
    $pagDiv.append('<ul>');
    var $ul = $pagDiv.find('ul');

    var clazz = offset === 0 ? 'disabled' : '';
    $ul.append('<li class="' + clazz + '"><a href="#">&laquo;</a></li>');
    result.push({ 'offset': 0, 'enabled': clazz !== 'disabled', 'li': $ul.find('li') });


    var length = limit * (maxPages - 1);
    var delta = limit * Math.floor(maxPages / 2);
    var start = offset - delta;
    if (start < 0) {
        start = 0;
    } else if ((start + length) >= total) {
        while ((start + length) >= total) start -= limit;
    }

    for (var i = start; i < (start + (maxPages * limit)) ; i += limit) {
        clazz = i === offset ? 'disabled' : '';
        $ul.append('<li class="' + clazz + '"><a href="#">' + (Math.floor(i / limit) + 1) + '</a></li>');
        result.push({ 'offset': i, 'enabled': clazz !== 'active', 'li': $ul.find('li:last') });
    }
    clazz = (offset + limit) >= total ? 'disabled' : '';
    $ul.append('<li class="' + clazz + '"><a href="#">&raquo;</a></li>');
    var lastOffset = total - limit;
    while (lastOffset % 10 !== 0) lastOffset++;
    result.push({ 'offset': lastOffset, 'enabled': clazz !== 'disabled', 'li': $ul.find('li:last') });

    if (onClick) {
        _.each(result, function (page) {
            page.li.click(function (e) {
                onClick(e, page);
            });
        });
    }

    return result;
};

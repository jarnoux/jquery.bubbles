/**
 * This function shows the bubble on mouseover on the element, given certain a config map:
 *              text:       - the html to be included in the bubble in the top half, will have id='jquerybubbles_bubble_text'
 *              subtext:    - the html to be included in the bubble in the bottom half, will have id='jquerybubbles_bubble_subtext'
 *              side:       - the side of the element the bubble will appear to. Can be either 'left', 'right', 'top' or 'bottom'
 *
 */
(function() {
    function Bubblify() {
        this.initialize.apply(this, arguments)
    }
    Bubblify.prototype = {
        initialize : function(container, config){
            var cont = $(container);
            cont.bind('mouseover', function(){
                show_bubble_at_element($(container), config.text, config.subtext, config.side);
            });
            cont.bind('mouseout', function(){
                hide_bubble();
            });
        }
    };
    jQuery.fn.bubbleify = function(config) {
        return this.each(function() {
            new Bubblify(this, config);
        });
    };
})(jQuery);


/**
 * This plugin transforms an element into a step for a tutorial.
 * config = {
 *              text:                       - the text to display in the bubble (see bubbleify())
 *              subtext:                    - the subtext to display in the bubble (see bubbleify())
 *              side:                       - the side to wich to display the bubble, can be 'up', 'bottom', 'left' or 'right' (see bubbleify())
 *              next:                       - the jQuery object that receives the next step
 *              finish:                     - the event type that will accomplish this step and trigger the next
 *              finish_receiver:            - (optional) the receiver of the finish event. By default set to <this>
 *              finish_callback():          - (optional) a function to execute once this step is finished.
 *              finish_condition(finish_event):   - (optional) a function which evaluation has to return true for the step to be considered completed.
 *                                                      The function is passed the finish event.
 *          }
 */
(function() {
    function Tutorialstep() {
        this.initialize.apply(this, arguments)
    }
    Tutorialstep.prototype = {
        initialize : function(container, config){
            var cont = $(container);
            var start_callback = function(event){
                if(event.target != container){
                    return true;
                }
                cont.unbind('tutorialstep', start_callback);
                show_bubble_at_element($(container), config.text, config.subtext, config.side);
                if(config.finish_receiver){
                    config.finish_receiver.bind(config.finish, end_callback);
                }else{
                    cont.bind(config.finish, end_callback)
                }
                event.stopPropagation();
                return false;
            }
            var end_callback = function(event){
                if(config.finish_condition){
                    if(!config.finish_condition(event)){
                        return true;
                    }
                }
                if(config.finish_receiver){
                    config.finish_receiver.unbind(config.finish, end_callback);
                }else{
                    cont.unbind(config.finish, end_callback)
                }                hide_bubble();
                if(config.finish_callback){
                    config.finish_callback();
                }
                try{
                    config.next.trigger('tutorialstep');
                }catch(Exception){}
            }
            cont.bind('tutorialstep', start_callback);
        }
    };
    jQuery.fn.tutorialstep = function(config) {
        return this.each(function() {
            new Tutorialstep(this, config);
        });
    };
})(jQuery);

function show_bubble_at_element(element, text, subtext, side){
    var id_bubble = $('#jquerybubbles_bubble');
    var id_bubble_arrow = $('#jquerybubbles_bubble_arrow');
    var id_bubble_text = $('#jquerybubbles_bubble_text');
    var id_bubble_subtext = $('#jquerybubbles_bubble_subtext');
    if(id_bubble.length == 0){
        id_bubble_text = $('<div id="jquerybubbles_bubble_text"></div>');
        id_bubble_subtext = $('<div id="jquerybubbles_bubble_subtext"></div>');
        id_bubble_arrow=$('<div id="jquerybubbles_bubble_arrow"></div>');
        id_bubble = $('<div id="jquerybubbles_bubble" style="border-radius: 1px"></div>')
        .append(id_bubble_text)
        .append(id_bubble_subtext)
        .append(id_bubble_arrow);
        $('body').prepend(id_bubble);
    }
    id_bubble_text.html(text);
    id_bubble_subtext.html(subtext);
    var offset_x;
    var offset_y;
    element.show();
    switch(side){
        case 'left':
            offset_x = -20 - id_bubble.outerWidth();
            offset_y = (element.outerHeight()-id_bubble.outerHeight())/2;
            id_bubble_arrow.css({
                'border-color': 'transparent transparent transparent #2A2A2A',
                'right': '-25px',
                'left': '',
                'top': (id_bubble.outerHeight()-20)/2+'px',
                'bottom': ''
            });
            break;
        case 'right':
            offset_x = 20 + element.outerWidth();
            offset_y = (element.outerHeight()-id_bubble.outerHeight())/2;
            id_bubble_arrow.css({
                'border-color': 'transparent #2A2A2A transparent transparent',
                'left': '-25px',
                'right': '',
                'top': (id_bubble.outerHeight()-20)/2+'px',
                'bottom': ''
            });
            break;
        case 'top':
            offset_x = (element.outerWidth()-id_bubble.outerWidth())/2;
            offset_y = -25 - id_bubble.outerHeight();
            id_bubble_arrow.css({
                'border-color': ' #2A2A2A transparent transparent transparent',
                'left': (id_bubble.outerWidth()-20)/2+'px',
                'right': '',
                'top': '',
                'bottom': '-25px'
            });
            break;
        case 'bottom':
            offset_x = (element.outerWidth()-id_bubble.outerWidth())/2;
            offset_y = 25 + element.outerHeight();
            id_bubble_arrow.css({
                'border-color': 'transparent transparent #2A2A2A transparent',
                'left': (id_bubble.outerWidth()-20)/2+'px',
                'right': '',
                'top': '-25px',
                'bottom': ''
            });
            break;
    }
    id_bubble.effect('highlight', {times: 2, color: 'darkgrey'});

    var pos_x = element.offset().left + offset_x;
    var pos_y = element.offset().top + offset_y;
    id_bubble.css({
        left: pos_x,
        top: Math.max(0, pos_y)
    });
}

function hide_bubble(){
    $('#jquerybubbles_bubble').hide();
}


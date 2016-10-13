/**
 * Rockform - Simple, flexible ajax webform.
 * @author rugoals@gmail.ru
 * @version 3.14.0
 */

// AMD support
(function(factory) {
        "use strict";
        if (typeof define === 'function' && define.amd) {
            // using AMD; register as anon module
            define(['jquery', 'jquery.form.min', 'jquery.mask.min'], factory);
        } else {
            // no AMD; invoke directly
            factory((typeof(jQuery) != 'undefined') ? jQuery : window.Zepto);
        }
    }

    (function($) {
        "use strict";

        var base_name_form = 'rockform';

        var mask_pattern = '';
        var mask_placeholder = {};

        var field_mask = {
            init: function() {

                $(document).on('focus', '[data-bf-mask]', function() {
                    field_mask.set($(this));
                });

                $('[data-bf-mask]').each(function() {
                    field_mask.set($(this));
                });
            },
            set: function(el) {
                mask_pattern = el.data('bf-mask');
                mask_placeholder = el.attr('placeholder');

                if (mask_pattern.length > 0) {

                    if (typeof mask_placeholder == 'undefined' || mask_placeholder.length < 1) {
                        mask_placeholder = mask_pattern.replace(/[a-z0-9]+?/gi, "_");
                    }

                    mask_placeholder = { placeholder: mask_placeholder };

                    el.mask(mask_pattern, mask_placeholder);
                }
            }
        }

        var tooltip = {
            init: function(el, err_msg) {

                if (err_msg.length > 0) {

                    tooltip.set({
                        'el': el,
                        'err_msg': err_msg
                    });

                    $(window).on("resize", {
                        'el': el,
                        'err_msg': err_msg
                    }, tooltip.set);

                } else {
                    //убираем тултип, если нету сообщения об ошибке
                    var id = el.attr('name');
                    if (id) {
                        $('[data-bf-tooltip-id="' + id + '"]').remove();
                    }
                }
            },
            set: function(event) {

                var el, err_msg;

                //Выбираем данные при прямой передачи и через событие ресайза
                if (event.data) {
                    el = event.data.el;
                    err_msg = event.data.err_msg;
                } else {
                    el = event.el;
                    err_msg = event.err_msg;
                }

                var id = el.attr('name');

                //получаем первый элемент формы для групп с одинаковым именем
                el = $( '[name="'+id+'"]:first', el.parents('form'));

                var pos = el.attr('data-bf-tooltip');

                //генерируем класс для тултипа
                if (typeof pos != 'undefined') {
                    pos = pos.replace(/[ ]+?/gi, "-");
                } else {

                    pos = el.parents('form').attr('data-bf-tooltip');

                    if (pos === undefined) {
                        pos = 'right-center';
                    } else {
                        pos = pos.replace(/[ ]+?/gi, "-");

                    }

                }

                $('[data-bf-tooltip-id="' + id + '"]').remove();
                el.after(
                    '<div class="bf-tooltip bf-tooltip-' + pos + '" data-bf-tooltip-id="' + id + '"> \
                         <div class="bf-arrow"></div>' + err_msg + '</div>'
                );

                tooltip.position(el);

            },
            reset: function() {
                $(window).off("resize", tooltip.set);
                $('.bf-tooltip').remove();

            },
            response: function(position, w_tooltip, min_dist, el_offset, el_outer_w, t) {
                var pos = position + w_tooltip + min_dist;
                var pos_min = $(window).outerWidth() - min_dist - w_tooltip;

                if (pos > $(window).outerWidth()) {
                    position = pos_min;
                }

                if (pos_min <= el_offset['left']) {
                    position = el_offset['left'];
                    t.width(el_outer_w - min_dist);
                }

                return position;
            },
            position: function(el) {
                var min_dist = 20;

                var el_offset = el.offset();

                if (typeof el_offset != 'undefined') {

                    var el_outer_h = el.outerHeight();
                    var el_outer_w = el.outerWidth();
                    var id = el.attr('name');

                    var t = $('[data-bf-tooltip-id="' + id + '"]');
                    var w_tooltip = t.outerWidth();
                    var h_tooltip = t.outerHeight();

                    var pos = el.attr('data-bf-tooltip');

                    if (pos === undefined) {

                        var pos = el.parents('form').attr('data-bf-tooltip');

                        if (pos === undefined) {
                            pos = 'right center';
                        }
                    }

                    if (pos == 'top right') {

                        var position = el_offset['left'] + el_outer_w / 6 * 5;
                        position = tooltip.response(position, w_tooltip, min_dist, el_offset, el_outer_w, t);

                        t.offset({
                            top: el_offset['top'] - h_tooltip,
                            left: position
                        });

                    } else if (pos == 'top center') {

                        var position = el_offset['left'] + el_outer_w / 2;
                        position = tooltip.response(position, w_tooltip, min_dist, el_offset, el_outer_w, t);

                        t.offset({
                            top: el_offset['top'] - h_tooltip,
                            left: position
                        });

                    } else if (pos == 'top') {

                        var position = el_offset['left'];
                        position = tooltip.response(position, w_tooltip, min_dist, el_offset, el_outer_w, t);

                        t.offset({
                            top: el_offset['top'] - h_tooltip,
                            left: position
                        });
                    } else if (pos == 'top left') {

                        var position = el_offset['left'] - el_outer_w / 6 * 5;

                        t.offset({
                            top: el_offset['top'] - h_tooltip,
                            left: position
                        });

                    } else if (pos == 'left center') {
                        var position = el_offset['left'] - w_tooltip;

                        t.offset({
                            top: el_offset['top'] + el_outer_h / 2 - h_tooltip / 2,
                            left: position
                        });

                    } else if (pos == 'bottom') {

                        var position = el_offset['left'];
                        position = tooltip.response(position, w_tooltip, min_dist, el_offset, el_outer_w, t);

                        t.offset({
                            top: el_offset['top'] + el_outer_h,
                            left: position
                        });

                    } else if (pos == 'bottom left') {

                        var position = el_offset['left'] - el_outer_w / 6 * 5;

                        t.offset({
                            top: el_offset['top'] + el_outer_h,
                            left: position
                        });

                    } else if (pos == 'bottom center') {

                        var position = el_offset['left'] + el_outer_w / 2;
                        position = tooltip.response(position, w_tooltip, min_dist, el_offset, el_outer_w, t);

                        t.offset({
                            top: el_offset['top'] + el_outer_h,
                            left: position
                        });

                    } else if (pos == 'bottom right') {

                        var position = el_offset['left'] + el_outer_w / 6 * 5;
                        position = tooltip.response(position, w_tooltip, min_dist, el_offset, el_outer_w, t);

                        t.offset({
                            top: el_offset['top'] + el_outer_h,
                            left: position
                        });

                    } else if (pos == 'right center') {
                        var position = el_offset['left'] + el_outer_w;

                        t.offset({
                            top: el_offset['top'] + el_outer_h / 2 - h_tooltip / 2,
                            left: position
                        });
                    }
                }
            }
        }

        var validation = {

            server: function(form, data, event) {

                var err_msg;
                var el;
                var valid = 0;

                tooltip.reset();

                if (data.mail_to) {

                    tooltip.init($(':focus', form), data.mail_to);
                    return false;
                }

                $.each(data, function(name, value) {
                    err_msg = '';

                    if (name == 'token') {
                        bf.set_attr_form(form, data.token, 'bf-token');
                    } else {

                        err_msg = validation.set_err_msg(value);
                        el = $('[name="' + name + '"]', form);
                        tooltip.init(el, err_msg);

                        if (err_msg.length > 0) {
                            valid = +1;
                        }
                    }
                });

                if (parseInt(valid) > 0) {
                    return false;
                } else {
                    return true;
                }
            },
            set_err_msg: function(err) {
                var err_msg = '';
                if (err.required) {
                    err_msg = err.required;
                } else {
                    if (err.rangelength) {
                        err_msg = err.rangelength;
                    } else if (err.minlength) {
                        err_msg = err.minlength;
                    } else if (err.maxlength) {
                        err_msg = err.maxlength;
                    } else {
                        $.each(err, function(name, msg) {
                            if (
                                name == 'required' ||
                                name == 'rangelength' ||
                                name == 'minlength' ||
                                name == 'maxlength'
                            ) {

                            } else {
                                err_msg = msg;
                                return false;
                            }
                        });
                    }
                }

                return err_msg;
            }
        }

        var popup = {

            init: function(path, data, custom_func, param_custom_func) {

                $.ajax({
                    url: path,
                    data: data,
                    method: "post",
                    dataType: "html",
                    beforeSend: function(xhr) {
                        popup.loader_on();
                    },
                    success: function(xhr) {

                        popup.set_overlay();
                        popup.set_close_event();

                        //animation begin
                        $('.bf-modal, .bf-fixed-overlay').css('opacity', '0');

                        $('.bf-modal-box').html(xhr);
                        popup.loader_off();

                        //animation end
                        $('.bf-modal, .bf-fixed-overlay').animate({
                            'opacity': "1"
                        }, 400);

                        custom_func(param_custom_func);
                    }
                });

            },

            set_overlay: function() {

                $(".bf-fixed-overlay").remove();
                $('body').append('<div class="bf-fixed-overlay bf-fixed-overlay__modal"> \
                            <div class="bf-modal"> \
                                <div class="bf-modal_container"> \
                                    <a href="javascript:;" data-bf-popup="close" class="bf-modal-close" title=""></a> \
                                      <div class="bf-modal-box"></div> \
                                </div> \
                            </div> \
                        </div>');

            },

            loader_on: function() {
                $('body').append('<div class="bf-loading"></div>');
            },
            loader_off: function() {
                $('.bf-loading').remove();
            },
            set_close_event: function() {
                $(document).on("click", "[data-bf-popup='close'], .bf-fixed-overlay", function() {
                    popup.close();
                });

                $(document).on("click", ".bf-modal", function(e) {
                    e.stopImmediatePropagation();
                });
            },
            close: function() {
                $(".bf-fixed-overlay").remove();
                bf.init_form(); //перезапускаем
            }
        };

        var capcha = {
            init: function() {
                capcha.update(); 
                $(document).on("click", 'img[data-bf-capcha]', function() {
                    capcha.update();
                });
            },
            update: function() {
                $('img[data-bf-capcha]').attr('src', bf.path + '?type=capcha&u=' + Math.random());
            }
        };

        var bf = {

            config: '',
            path: '/' + base_name_form + '/init.php',
            timer: function(form) {
                var def = 2000;

                var timer = form.data('bf-timer');
                if (typeof timer != 'undefined') {
                    if(parseInt(timer) > 0) {
                        def = timer;
                    }
                }
                console.log(def);
                return def;
            },
            init: function() {
                bf.init_form();
                bf.init_popup_form();
            },
            init_popup_form: function() {
                $(document).on('click', '[data-bf-config]:not(form)', function(e) {
                    e.preventDefault();

                    var config_popup = $(this).data("bf-config");
                    if (typeof config_popup == 'undefined' || config_popup.length < 1) {
                        config_popup = '';
                    }

                    var attributes = bf.get_custom_popup_attributes($(this));

                    popup.init(
                        bf.path, {
                            'bf-config': config_popup,
                            'attributes': attributes,
                            'type': 'form'
                        },
                        bf.init_form, {
                            'config_popup': config_popup,
                            'attributes': attributes
                        }
                    );

                });

            },
            get_custom_popup_attributes: function(button) {

                var attributes = {};
                var attr_el = '';

                if (button.length) {
                    $.each(button[0].attributes, function(index, attr) {
                        attr_el = attr.name;
                        if (/data\-bf\-field/.test(attr_el)) {
                            attr_el = attr_el.replace('data-bf-', '');
                            attributes[attr_el] = attr.value;
                        }
                    });
                }

                attributes['field_page_h1'] = $('h1').html();
                attributes['field_page_link'] = document.location.href;

                return attributes;

            },
            init_form: function(param) {

                capcha.init();
                field_mask.init();
                tooltip.reset();

                $(document)
                    .off('submit', 'form[data-bf-config], .bf-modal form')
                    .on('submit', 'form[data-bf-config], .bf-modal form',
                        function(e) {
                            e.preventDefault();

                            var form = $(this);
                            if (typeof param == 'undefined') {
                                param = {};
                                param.config_popup = '';
                            }
                            bf.config = bf.get_config(param.config_popup, form.data("bf-config"));

                            //сериализуем форму
                            var formdata = form.formToArray();

                            //заменяем объект файла именем файла
                            $.each(formdata, function(index, element) {
                                if (element.type == 'file') {
                                    formdata[index].value = element.value.name
                                }
                            });

                            //серверная валидация
                            $.post(
                                bf.path, {
                                    'fields': formdata,
                                    'type': 'validation',
                                    'bf-config': bf.config
                                },
                                function(data) {

                                    bf.set_attr_form(form, bf.config, 'bf-config');

                                    //вывод ошибок валидации и уведомлений
                                    if (validation.server(form, data, e)) {

                                        //добавляем дополнительные параметры в форму из всплывающего окна
                                        if (typeof param.attributes != 'undefined') {
                                            $.each(param.attributes, function(name_item, value_item) {
                                                bf.set_attr_form(form, value_item, name_item);
                                            });
                                        }

                                        form.ajaxSubmit({
                                            beforeSubmit: function(arr, form, options) { 
                                                $(':focus', form).prop('disabled', true);
                                            },
                                            success: bf.show_response,
                                            url: bf.path,
                                            type: 'post',
                                            dataType: 'json'
                                        });

                                    }
                                    $('.bf-attr').remove();
                                });

                        });
            },
            set_attr_form: function(form, value, name) {
                form.prepend('<input name="' + name + '" class="bf-attr" type="hidden" value="' + value + '" />');
            },
            get_config: function(config_popup, config) {
                if (typeof config_popup == 'undefined' || config_popup.length < 1) {
                    if (typeof config == 'undefined' || config.length < 1) {
                        config = '';
                    }
                } else {
                    config = config_popup;
                }
                return config;
            },
            show_response: function(response, statusText, xhr, form) {

                $(':focus', form).prop('disabled', false);

                if (response['status'] > 0) {

                    form.hide();

                    $.ajax({
                        url: bf.path,
                        data: { 'type': 'form_success', 'bf-config': response['bf-config'] },
                        method: "post",
                        dataType: "html",
                        beforeSend: function(content) {

                        },
                        success: function(content) {
 
                            form.after(content);

                            setTimeout(
                                function() {
                                    popup.close();
                                }, bf.timer(form)
                            );

                            setTimeout(
                                function() {
                                    form.show();
                                    form.clearForm();
                                    $('[data-bf-success]').remove();
                                }, (bf.timer(form) + 1000)
                            );
                        }
                    });

                } else {
                    tooltip.init($(':focus', form), response['value']);
                }
            },

            set_success_template: function() {

            }
        }
        bf.init();
    })
);

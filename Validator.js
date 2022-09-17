function Validator(option) {

    var selectorRules = {};

    //Hàm thực hiện validate

    function Validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector('.form-message')
        var errorMessage ;

        //lấy ra các rules của selector

        var rules = selectorRules[rule.selector]

        //lặp qua từng rules và check
        for(var i = 0; i< rules.length ; i++ ){
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if(errorMessage) {
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add('invalid')
        }else {
            errorElement.innerText = ''
            inputElement.parentElement.classList.remove('invalid')
        }
    }

    //lấy element của form cần validate

    var formElement = document.querySelector(option.form)

    if(formElement) {
        //khi submit form
        formElement.onsubmit = function(e) {
            e.preventDefault()

            //lặp qua từng rules và validate
            option.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector)
                Validate(inputElement, rule)
            })

        }

        //lặp qua mỗi rule và sử lý (lắng nghe các sự kiện blur, input,...)
        option.rules.forEach(function(rule) {

            //Lưu lại các rules cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            }else {
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElement = formElement.querySelector(rule.selector)
            if(inputElement) {

                // xử lý trường hợp blur ra ngoài
                inputElement.onblur = function() {
                    Validate(inputElement, rule)
                }

                // xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector('.form-message')
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })

    }
}

//Định nghĩa rule
//Nguyên tắc của các rule
//1.khi có lỗi => trả ra message lỗi
//2.khi không có lỗi không trả ra cái gì cả

Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined :message || 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 
            return regex.test(value) ? undefined : 'Vui lòng nhập email'
        }
    }
}
Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }
}
Validator.isConfirmed = function(selector, getConfirmValue,message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Nhập không chính xác'
        }
    }
}   
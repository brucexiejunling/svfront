let randstr = function(length){
    let key = {

        str : [
            '1','2','3','4','5','6','7','8','9'
        ],

        randint : function(n,m){
            let c = m-n+1;
            let num = Math.random() * c + n;
            return  Math.floor(num);
        },

        randStr : function(){
            let _this = this;
            let leng = _this.str.length - 1;
            let randkey = _this.randint(0, leng);
            return _this.str[randkey];
        },

        create : function(len){
            let _this = this;
            let l = len || 10;
            let str = '';

            for(let i = 0 ; i<l ; i++){
                str += _this.randStr();
            }

            return str;
        }

    };

    length = length ? length : 10;

    return key.create(length);
};

let randint = function(n,m){
    let c = m-n+1;
    let num = Math.random() * c + n;
    return  Math.floor(num);
};

let Captcha = function(dom, options){
    this.codeDoms = [];
    this.lineDoms = [];
    this.initOptions(options);
    this.dom = dom;
    this.init();
    this.addEvent();
    this.update();
    this.mask();
};

Captcha.prototype.init = function(){
    this.dom.style.position = "relative";
    this.dom.style.overflow = "hidden";
    this.dom.style.cursor = "pointer";
    this.dom.title = "点击更换验证码";
    this.dom.style.background = this.options.bgColor;
    this.w = this.dom.clientWidth;
    this.h = this.dom.clientHeight;
    this.uW = this.w / this.options.len;
};

Captcha.prototype.mask = function(){
    let dom = document.createElement("div");
    dom.style.cssText = [
        "width: 100%",
        "height: 100%",
        "left: 0",
        "top: 0",
        "position: absolute",
        "cursor: pointer",
        "z-index: 9999999"
    ].join(";");

    dom.title = "点击更换验证码";

    this.dom.appendChild(dom);
};

Captcha.prototype.addEvent = function(){
    let _this = this;
    _this.dom.addEventListener("touchend", function(){
        _this.update.call(_this);
    });
};

Captcha.prototype.initOptions = function(options){

    let f = function(){
        this.len = 4;
        this.fontSizeMin = 20;
        this.fontSizeMax = 48;
        this.colors = [
            "#999",
            "#00c09b",
            "#c40000",
            "#3644e8"
        ];
        this.bgColor = "#FFF";
        this.fonts = [
            "sans-serif",
            "arial"
        ];
        this.lines = 2;
        this.lineColors = [
            "#888888",
            "#FF7744",
            "#888800",
            "#008888"
        ];

        this.lineHeightMin = 1;
        this.lineHeightMax = 3;
        this.lineWidthMin = 1;
        this.lineWidthMax = 60;
    };

    this.options = new f();

    if(typeof options === "object"){
        for(i in options){
            this.options[i] = options[i];
        }
    }
};

Captcha.prototype.update = function(){
    for(let i=0; i<this.codeDoms.length; i++){
        this.dom.removeChild(this.codeDoms[i]);
    }
    for(let i=0; i<this.lineDoms.length; i++){
        this.dom.removeChild(this.lineDoms[i]);
    }
    this.createCode();
    this.draw();
};

Captcha.prototype.createCode = function(){
    this.code = randstr(this.options.len);
};

Captcha.prototype.verify = function(code){
    return this.code.toLowerCase() === code.toLowerCase();
};

Captcha.prototype.draw = function(){
    this.codeDoms = [];
    for(let i=0; i<this.code.length; i++){
        this.codeDoms.push(this.drawCode(this.code[i], i));
    }

    this.drawLines();
};

Captcha.prototype.drawCode = function(code, index){
    let dom = document.createElement("span");

    dom.style.cssText = [
        "font-size:" + randint(25, 35) + "px",
        "color:" + this.options.colors[randint(0,  this.options.colors.length - 1)],
        "position: absolute",
        "left:" + randint(20 * index, 20 * index + 10)+ "px",
        "top:" + randint(0, 1) + "px",
        "transform:rotate(" + randint(-30, 30) + "deg)",
        "-ms-transform:rotate(" + randint(-30, 30) + "deg)",
        "-moz-transform:rotate(" + randint(-30, 30) + "deg)",
        "-webkit-transform:rotate(" + randint(-30, 30) + "deg)",
        "-o-transform:rotate(" + randint(-30, 30) + "deg)",
        "font-family:" + this.options.fonts[randint(0, this.options.fonts.length - 1)],
        "font-weight:" + randint(400, 900)
    ].join(";");

    dom.innerHTML = code;
    this.dom.appendChild(dom);

    return dom;
};

Captcha.prototype.drawLines = function(){
    this.lineDoms = [];
    for(let i=0; i<this.options.lines; i++){
        let dom = document.createElement("div");

        dom.style.cssText = [
            "position: absolute",
            "opacity: " + randint(3, 8) / 10,
            "width:" + randint(this.options.lineWidthMin, this.options.lineWidthMax) + "px",
            "height:" + randint(this.options.lineHeightMin, this.options.lineHeightMax) + "px",
            "background: " + this.options.lineColors[randint(0, this.options.lineColors.length - 1)],
            "left:" + randint(0, this.w - 20) + "px",
            "top:" + randint(0, this.h) + "px",
            "transform:rotate(" + randint(-30, 30) + "deg)",
            "-ms-transform:rotate(" + randint(-30, 30) + "deg)",
            "-moz-transform:rotate(" + randint(-30, 30) + "deg)",
            "-webkit-transform:rotate(" + randint(-30, 30) + "deg)",
            "-o-transform:rotate(" + randint(-30, 30) + "deg)",
            "font-family:" + this.options.fonts[randint(0, this.options.fonts.length - 1)],
            "font-weight:" + randint(400, 900)
        ].join(";");
        this.dom.appendChild(dom);

        this.lineDoms.push(dom);
    }
};

module.exports = Captcha;

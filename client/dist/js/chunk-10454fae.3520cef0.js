(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-10454fae"],{"1b83":function(e,t,a){"use strict";var n="6LftgdoUAAAAAFsue2KOClJ7QLBnV2GAI28DRbTt";t["a"]=n},a1bb:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{visible:e.isVisible,width:"80%",top:"12vh","custom-class":e.customDialogClass,"close-on-click-modal":!1},on:{"update:visible":function(t){e.isVisible=t}}},[a("header",{staticClass:"header p0 no-selectable",attrs:{slot:"title"},slot:"title"},[a("h1",{staticClass:"inline-block font-semibold fs-xlarge"},[e._v(" Buy Now! - "),a("span",{staticClass:"capitalize"},[e._v(e._s(e.dialogTitle))])])]),a("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"form",staticClass:"pr2 pl2",attrs:{model:e.form,rules:e.formRules}},[a("el-row",{attrs:{gutter:15}},[a("el-col",{attrs:{xs:24,sm:24,md:24,lg:24,xl:8}},[a("el-form-item",{attrs:{label:"Company name",prop:"company"}},[a("el-input",{class:{dark:e.dark},model:{value:e.form.company,callback:function(t){e.$set(e.form,"company",t)},expression:"form.company"}})],1)],1),a("el-col",{attrs:{xs:24,sm:12,md:24,lg:12,xl:8}},[a("el-form-item",{attrs:{label:"Full Name",prop:"fullname"}},[a("el-input",{class:{dark:e.dark},model:{value:e.form.fullname,callback:function(t){e.$set(e.form,"fullname",t)},expression:"form.fullname"}})],1)],1),a("el-col",{attrs:{xs:24,sm:12,md:24,lg:12,xl:8}},[a("el-form-item",{attrs:{label:"Phone number"}},[a("div",{staticClass:"el-input"},[a("i-phone-input",{staticClass:"m0 p0 el-input__inner",attrs:{inputClasses:"el-input__inner issues-dialog"},on:{onInput:e.validatePhoneNumber},model:{value:e.form.phonenumber.num,callback:function(t){e.$set(e.form.phonenumber,"num",t)},expression:"form.phonenumber.num"}})],1),a("el-collapse-transition",[e.form.phonenumber.num&&!e.form.phonenumber.valid?a("el-alert",{staticClass:"mt2 h8",attrs:{type:"error","show-icon":"",title:"This phone number is not valid",closable:!1}}):e._e()],1)],1)],1)],1),a("el-row",{attrs:{gutter:30}},[a("el-col",{attrs:{xs:24,sm:12,md:24,lg:12,xl:12}},[a("el-form-item",{attrs:{label:"Email",prop:"email"}},[a("el-input",{class:{dark:e.dark},attrs:{type:"email"},model:{value:e.form.email,callback:function(t){e.$set(e.form,"email",t)},expression:"form.email"}})],1)],1),"Other"!==e.dialogTitle?["Datacenter"!==e.dialogTitle?a("el-col",{attrs:{md:24,lg:12}},[a("el-form-item",{attrs:{label:"Capacity",prop:"capacity"}},[a("el-select",{staticClass:"w-fit-full",class:{dark:e.dark},attrs:{filterable:"",placeholder:"Select an option"},model:{value:e.form.capacity,callback:function(t){e.$set(e.form,"capacity",t)},expression:"form.capacity"}},e._l(e.capacities,(function(e){return a("el-option",{key:e,attrs:{label:e,value:e}})})),1)],1)],1):a("el-col",{attrs:{span:12}},[a("div",{staticClass:"block"},[a("el-form-item",{attrs:{prop:"rack"}},[a("span",{attrs:{slot:"label"},slot:"label"},[a("span",{staticClass:"text-red"},[e._v("*")]),e._v(" Rack total ")]),a("br"),a("div",{staticClass:"block"},[a("el-slider",{staticClass:"relative",attrs:{id:"rack-slider","show-input":"","input-size":"small"},model:{value:e.form.totalRack,callback:function(t){e.$set(e.form,"totalRack",t)},expression:"form.totalRack"}})],1)])],1)])]:e._e(),e.isBackboneSelection?[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"From (A-end)",prop:"fromA"}},[a("autocomplete-google",{attrs:{size:"regular",id:"pointA"},on:{"place-changed":function(t){return e.handleAddressChanged(t,"a")}}})],1)],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"To (B-end)",prop:"toB"}},[a("autocomplete-google",{attrs:{size:"regular",id:"pointB"},on:{"place-changed":function(t){return e.handleAddressChanged(t,"b")}}})],1)],1)]:e._e(),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:"Message",prop:"message"}},[a("el-input",{class:{dark:e.dark},attrs:{type:"textarea",rows:"4"},model:{value:e.form.message,callback:function(t){e.$set(e.form,"message",t)},expression:"form.message"}})],1)],1),a("el-col",{attrs:{span:24}},[a("vue-recaptcha",{ref:"catpcha",attrs:{sitekey:e.siteKey,loadRecaptchaScript:!0},on:{verify:e.handleCatchaVerification,error:function(){return e.catchaVerified=!1},expired:function(){return e.catchaVerified=!1}}})],1)],2)],1),a("footer",{staticClass:"footer flex wrap justify-content-space-between pr0 pl6 mt4"},[a("small",{staticClass:"inline-block mt2 mb4"},[a("span",{staticClass:"text-red"},[e._v("*")]),e._v(" indicates required field ")]),a("div",[a("el-button",{staticClass:"mr2",attrs:{plain:"",type:"info"},on:{click:e.closeDialog}},[e._v("Cancel")]),a("el-button",{staticClass:"w-fit-content",attrs:{disabled:e.isFormUncomplete,type:"primary",plain:"",loading:e.isSendingData},on:{click:function(t){return e.submitForm("form")},keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")&&e._k(t.keyCode,"space",32,t.key,[" ","Spacebar"])?null:e.submitForm("form")}}},[e._v("Submit Request")])],1)])],1)},r=[],i=(a("99af"),a("4de4"),a("caad"),a("d81d"),a("b0c0"),a("b64b"),a("2532"),a("4c53"),a("b85c")),o=(a("96cf"),a("1da1")),s=a("5530"),l=a("2f62"),c=a("9a1e"),u=a("4aec"),d=a("0316"),m=a("ceaf"),p=a("e096"),f=a("1b83"),h=a("fc4a"),b=a("ddbf"),g={components:{VueRecaptcha:p["a"],AutocompleteGoogle:h["a"]},data:function(){return{capacities:["1GB","10GB","100GB","Others"],loading:!1,siteKey:f["a"],isSendingData:!1,catchaVerified:null,form:{company:"",email:"",fullname:"",capacity:"",totalRack:0,message:"",phonenumber:{num:"",valid:null},address:{pointA:null,pointB:null}},formRules:{phonenumber:[],message:[],fromA:[],toB:[],fullname:[{required:!0,message:"Please input your full name",trigger:"blur"},{min:3,max:10,message:"Length should be 3 to 10",trigger:["change","blur"]}],company:[{required:!0,message:"Company name is required",trigger:"blur"}],email:[{required:!0,message:"Please input your email",trigger:"blur"},{type:"email",required:!0,message:"Please input a valid email",trigger:"change"}],capacity:[{required:!0,message:"Please select the desired capacity",trigger:"change"}]}}},computed:Object(s["a"])({},Object(l["c"])({buyType:function(e){return e.buyType},dark:function(e){return e.isDark},focus:function(e){return e.map.focus}}),{isBackboneSelection:function(){return this.focus&&"backbone"===this.dialogTitle.toLowerCase()},isVisible:{get:function(){return this.$store.state.isBuyDialog},set:function(){return this.closeDialog()}},dialogTitle:function(){return this.buyType&&this.buyType.title||""},isFormUncomplete:function(){var e=this,t=Object.keys(this.form).filter((function(t){return!e.form[t]}));return!!(t.length&&"Datacenter"===this.dialogTitle&&t.includes("totalRack")||!this.catchaVerified)},customDialogClass:function(){return this.dark?"custom-dialog dark":"custom-dialog light"}}),watch:{isVisible:function(e){return e?this.setUserData():this.$refs.catpcha.reset()}},methods:{handleCatchaVerification:function(e){e&&(this.catchaVerified=!0)},setUserData:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){var a,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.$auth.user){t.next=2;break}return t.abrupt("return");case 2:return t.next=4,Object(c["a"])(e.$auth.user.sub);case 4:a=t.sent,a&&(e.loading=!0,n=a.user_metadata,e.form.fullname=n&&n.name?n.name:Object(b["a"])(a.name)?"":a.name,e.form.email=n&&n.email?n.email:a.email,e.form.company=n&&n.companyname?n.companyname:"",e.form.phonenumber=n&&n.phonenumber?n.phonenumber:{num:"",valid:null},e.loading=!1);case 6:case"end":return t.stop()}}),t)})))()},handleAddressChanged:function(e,t){switch(t){case"b":this.form.address.pointB=Object(s["a"])({},e);break;default:this.form.address.pointA=Object(s["a"])({},e);break}},sendBuyRequest:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){var a,n,r,o,l,c,d,p,f,h,b;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.isSendingData=!0,a=Object(s["a"])({cable:e.$store.state.map.currentSelection.name,type:e.dialogTitle},e.form),"backbone"!==e.dialogTitle.toLowerCase())n=""!==a.message?a.message:"Hi, ".concat(a.fullname," (").concat(a.email,")\n          , you asked to buy an amount of ").concat(a.capacity," for ").concat(a.cable,"(").concat(a.type,")");else if(a.address.pointA&&a.address.pointB&&"backbone"===e.dialogTitle.toLowerCase()){r="",o="",l=Object(i["a"])(a.address.pointA.address_components);try{for(l.s();!(c=l.n()).done;)d=c.value,d.types.includes("postal_code")&&(r=d.short_name)}catch(g){l.e(g)}finally{l.f()}p=Object(i["a"])(a.address.pointB.address_components);try{for(p.s();!(f=p.n()).done;)h=f.value,h.types.includes("postal_code")&&(o=h.short_name)}catch(g){p.e(g)}finally{p.f()}n=""!==a.message?"".concat(a.message," from pointA ").concat(a.address.pointA.fullAddress).concat(r&&""!==r?"("+r+")":""," to pointB ").concat(a.address.pointB.fullAddress).concat(o&&""!==o?"("+o+")":""):"Hi, ".concat(a.fullname," (").concat(a.email,")\n          , you asked to buy an amount of ").concat(a.capacity," for ").concat(a.cable,"(").concat(a.type,") from pointA ").concat(a.address.pointA.fullAddress).concat(r&&""!==r?"("+r+")":""," to pointB ").concat(a.address.pointB.fullAddress).concat(o&&""!==o?"("+o+")":"")}return t.next=5,Object(u["d"])({email:a.email,phone:a.phonenumber,message:n,elemnt:e.focus.id,user_id:e.$auth.user.sub,t:Object(m["a"])(e.focus.type)});case 5:b=t.sent,b&&b.t&&"error"!=b.t&&e.closeDialog(),e.isSendingData=!1;case 8:case"end":return t.stop()}}),t)})))()},validatePhoneNumber:function(e){var t=e.number,a=e.isValid;try{this.form.phonenumber={num:t,valid:a}}catch(n){}},submitForm:function(e){var t=this;this.$refs[e].validate((function(e){if(!e)return!1;t.sendBuyRequest()}))},closeDialog:function(){this.$store.commit("".concat(d["j"]),!1),this.$refs.form.resetFields(),this.form={company:"",email:"",message:"",fullname:"",capacity:"",totalRack:0,phonenumber:{num:"",valid:null},address:{pointA:null,pointB:null}},this.$store.commit("".concat(d["a"]),null)}}},y=g,v=a("2877"),k=Object(v["a"])(y,n,r,!1,null,null,null);t["default"]=k.exports},ddbf:function(e,t,a){"use strict";function n(e){var t=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return t.test(String(e).toLowerCase())}a.d(t,"a",(function(){return n}))},e096:function(e,t,a){"use strict";function n(){return n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e},n.apply(this,arguments)}var r=function(){var e=!1,t=[],a=function(a){if(!e){e=!0;for(var n=0,r=t.length;n<r;n++)t[n](a)}},n=function(a){e?a():t.push(a)},r={resolved:function(){return e},resolve:a,promise:{then:n}};return r},i=Object.prototype.hasOwnProperty;function o(){var e=r();return{notify:function(){e.resolve()},wait:function(){return e.promise},render:function(e,t,a){this.wait().then((function(){a(window.grecaptcha.render(e,t))}))},reset:function(e){"undefined"!==typeof e&&(this.assertLoaded(),this.wait().then((function(){return window.grecaptcha.reset(e)})))},execute:function(e){"undefined"!==typeof e&&(this.assertLoaded(),this.wait().then((function(){return window.grecaptcha.execute(e)})))},checkRecaptchaLoad:function(){i.call(window,"grecaptcha")&&i.call(window.grecaptcha,"render")&&this.notify()},assertLoaded:function(){if(!e.resolved())throw new Error("ReCAPTCHA has not been loaded")}}}var s=o();"undefined"!==typeof window&&(window.vueRecaptchaApiLoaded=s.notify);var l={name:"VueRecaptcha",props:{sitekey:{type:String,required:!0},theme:{type:String},badge:{type:String},type:{type:String},size:{type:String},tabindex:{type:String},loadRecaptchaScript:{type:Boolean,default:!1},recaptchaScriptId:{type:String,default:"__RECAPTCHA_SCRIPT"},recaptchaHost:{type:String,default:"www.google.com"},language:{type:String,default:""}},beforeMount:function(){if(this.loadRecaptchaScript&&!document.getElementById(this.recaptchaScriptId)){var e=document.createElement("script");e.id=this.recaptchaScriptId,e.src="https://"+this.recaptchaHost+"/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit&hl="+this.language,e.async=!0,e.defer=!0,document.head.appendChild(e)}},mounted:function(){var e=this;s.checkRecaptchaLoad();var t=n({},this.$props,{callback:this.emitVerify,"expired-callback":this.emitExpired,"error-callback":this.emitError}),a=this.$slots["default"]?this.$el.children[0]:this.$el;s.render(a,t,(function(t){e.$widgetId=t,e.$emit("render",t)}))},methods:{reset:function(){s.reset(this.$widgetId)},execute:function(){s.execute(this.$widgetId)},emitVerify:function(e){this.$emit("verify",e)},emitExpired:function(){this.$emit("expired")},emitError:function(){this.$emit("error")}},render:function(e){return e("div",{},this.$slots["default"])}};t["a"]=l}}]);
//# sourceMappingURL=chunk-10454fae.3520cef0.js.map
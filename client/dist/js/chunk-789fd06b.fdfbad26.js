(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-789fd06b"],{"1b83":function(e,t,i){"use strict";var a="6LftgdoUAAAAAFsue2KOClJ7QLBnV2GAI28DRbTt";t["a"]=a},"7a7f":function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-dialog",{attrs:{visible:e.isVisible,width:"40%",top:"12vh","custom-class":e.customDialogClass,"close-on-click-modal":!1},on:{"update:visible":function(t){e.isVisible=t}}},[i("header",{staticClass:"header p0 no-selectable",attrs:{slot:"title"},slot:"title"},[i("h1",{staticClass:"inline-block font-semibold fs-xlarge"},[i("span",{staticClass:"capitalize"},[e._v("Request to verify ownership")])])]),i("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"pr2 pl2"},[i("el-form-item",{attrs:{label:"Email"}},[i("el-input",{class:{dark:e.dark},attrs:{type:"email"},model:{value:e.email,callback:function(t){e.email=t},expression:"email"}})],1),i("el-form-item",[i("vue-recaptcha",{ref:"catpcha",attrs:{sitekey:e.siteKey,loadRecaptchaScript:!0},on:{verify:e.handleCatchaVerification,error:function(){return e.catchaVerified=!1},expired:function(){return e.catchaVerified=!1}}})],1)],1),i("footer",{staticClass:"footer flex wrap justify-content-end pr0 pl6"},[i("div",[i("el-button",{staticClass:"mr2",class:{dark:e.dark},attrs:{plain:"",type:"info"},on:{click:e.closeDialog}},[e._v("Cancel")]),i("el-button",{class:{dark:e.dark},attrs:{disabled:e.isFormUncomplete,type:"primary",plain:"",loading:e.sendingData},on:{click:e.submitForm,keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")&&e._k(t.keyCode,"space",32,t.key,[" ","Spacebar"])?null:e.submitForm(t)}}},[e._v("Send request")])],1)])],1)},n=[],r=(i("d81d"),i("4c53"),i("96cf"),i("1da1")),c=i("5530"),s=i("2f62"),o=i("9a1e"),u=i("2c2f"),l=i("39a1"),d=i("0316"),f=i("ceaf"),p=i("e096"),h=i("1b83"),m={components:{VueRecaptcha:p["a"]},data:function(){return{siteKey:h["a"],email:"",loading:!1,sendingData:!1,catchaVerified:null}},computed:Object(c["a"])({},Object(s["c"])({focus:function(e){return e.map.focus},dark:function(e){return e.isDark}}),{isVisible:{get:function(){return this.$store.state.isVerificationDialog},set:function(){return this.closeDialog()}},isFormUncomplete:function(){return""===this.email||!this.catchaVerified},customDialogClass:function(){return this.dark?"custom-dialog dark":"custom-dialog light"}}),watch:{isVisible:function(e){if(!e)return this.$refs.catpcha.reset();this.setUserData()}},methods:{handleCatchaVerification:function(e){e&&(this.catchaVerified=!0)},setUserData:function(){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function t(){var i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.$auth.user){t.next=2;break}return t.abrupt("return");case 2:return e.loading=!0,t.next=5,Object(o["a"])(e.$auth.user.sub);case 5:i=t.sent,i&&(e.email=i.user_metadata&&i.user_metadata.email?i.user_metadata.email:i.email),e.loading=!1;case 8:case"end":return t.stop()}}),t)})))()},submitForm:function(){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function t(){var i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.sendingData=!0,t.next=3,Object(u["b"])({user_id:e.$auth.user.sub,email:e.email,elemnt:e.focus.id,type:Object(f["a"])(e.focus.type)});case 3:i=t.sent,e.sendingData=!1,i&&"error"!==i.t&&e.closeDialog();case 6:case"end":return t.stop()}}),t)})))()},closeDialog:function(){this.$store.commit("".concat(d["q"]),!1),this.$store.commit("".concat(l["f"]),null),this.email=""}}},g=m,b=i("2877"),y=Object(b["a"])(g,a,n,!1,null,null,null);t["default"]=y.exports},e096:function(e,t,i){"use strict";function a(){return a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(e[a]=i[a])}return e},a.apply(this,arguments)}var n=function(){var e=!1,t=[],i=function(i){if(!e){e=!0;for(var a=0,n=t.length;a<n;a++)t[a](i)}},a=function(i){e?i():t.push(i)},n={resolved:function(){return e},resolve:i,promise:{then:a}};return n},r=Object.prototype.hasOwnProperty;function c(){var e=n();return{notify:function(){e.resolve()},wait:function(){return e.promise},render:function(e,t,i){this.wait().then((function(){i(window.grecaptcha.render(e,t))}))},reset:function(e){"undefined"!==typeof e&&(this.assertLoaded(),this.wait().then((function(){return window.grecaptcha.reset(e)})))},execute:function(e){"undefined"!==typeof e&&(this.assertLoaded(),this.wait().then((function(){return window.grecaptcha.execute(e)})))},checkRecaptchaLoad:function(){r.call(window,"grecaptcha")&&r.call(window.grecaptcha,"render")&&this.notify()},assertLoaded:function(){if(!e.resolved())throw new Error("ReCAPTCHA has not been loaded")}}}var s=c();"undefined"!==typeof window&&(window.vueRecaptchaApiLoaded=s.notify);var o={name:"VueRecaptcha",props:{sitekey:{type:String,required:!0},theme:{type:String},badge:{type:String},type:{type:String},size:{type:String},tabindex:{type:String},loadRecaptchaScript:{type:Boolean,default:!1},recaptchaScriptId:{type:String,default:"__RECAPTCHA_SCRIPT"},recaptchaHost:{type:String,default:"www.google.com"},language:{type:String,default:""}},beforeMount:function(){if(this.loadRecaptchaScript&&!document.getElementById(this.recaptchaScriptId)){var e=document.createElement("script");e.id=this.recaptchaScriptId,e.src="https://"+this.recaptchaHost+"/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit&hl="+this.language,e.async=!0,e.defer=!0,document.head.appendChild(e)}},mounted:function(){var e=this;s.checkRecaptchaLoad();var t=a({},this.$props,{callback:this.emitVerify,"expired-callback":this.emitExpired,"error-callback":this.emitError}),i=this.$slots["default"]?this.$el.children[0]:this.$el;s.render(i,t,(function(t){e.$widgetId=t,e.$emit("render",t)}))},methods:{reset:function(){s.reset(this.$widgetId)},execute:function(){s.execute(this.$widgetId)},emitVerify:function(e){this.$emit("verify",e)},emitExpired:function(){this.$emit("expired")},emitError:function(){this.$emit("error")}},render:function(e){return e("div",{},this.$slots["default"])}};t["a"]=o}}]);
//# sourceMappingURL=chunk-789fd06b.fdfbad26.js.map
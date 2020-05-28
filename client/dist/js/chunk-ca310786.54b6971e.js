(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ca310786"],{a1bb:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{visible:e.isVisible,width:"80%",top:"12vh","custom-class":e.customDialogClass,"close-on-click-modal":!1},on:{"update:visible":function(t){e.isVisible=t}}},[a("header",{staticClass:"header p0 no-selectable",attrs:{slot:"title"},slot:"title"},[a("h1",{staticClass:"inline-block font-semibold fs-xlarge"},[e._v(" Buy Now! - "),a("span",{staticClass:"capitalize"},[e._v(e._s(e.dialogTitle))])])]),a("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"form",staticClass:"pr2 pl2",attrs:{model:e.form,rules:e.formRules}},[a("el-row",{attrs:{gutter:15}},[a("el-col",{attrs:{xs:24,sm:12,md:24,lg:24,xl:12}},[a("el-form-item",{attrs:{label:"Company name",prop:"company"}},[a("el-input",{class:{dark:e.dark},model:{value:e.form.company,callback:function(t){e.$set(e.form,"company",t)},expression:"form.company"}})],1)],1),a("el-col",{attrs:{xs:24,sm:12,md:24,lg:24,xl:12}},[a("el-form-item",{attrs:{label:"Full Name",prop:"fullname"}},[a("el-input",{class:{dark:e.dark},model:{value:e.form.fullname,callback:function(t){e.$set(e.form,"fullname",t)},expression:"form.fullname"}})],1)],1)],1),a("el-row",{attrs:{gutter:30}},[a("el-col",{attrs:{xs:24,sm:24,md:24,lg:12,xl:12}},[a("el-form-item",{attrs:{label:"Email",prop:"email"}},[a("el-input",{class:{dark:e.dark},attrs:{type:"email"},model:{value:e.form.email,callback:function(t){e.$set(e.form,"email",t)},expression:"form.email"}})],1)],1),"Other"!==e.dialogTitle?["Datacenter"!==e.dialogTitle?a("el-col",{attrs:{md:24,lg:12}},[a("el-form-item",{attrs:{label:"Capacity",prop:"capacity"}},[a("el-select",{staticClass:"w-fit-full",class:{dark:e.dark},attrs:{filterable:"",placeholder:"Select an option"},model:{value:e.form.capacity,callback:function(t){e.$set(e.form,"capacity",t)},expression:"form.capacity"}},e._l(e.capacities,(function(e){return a("el-option",{key:e,attrs:{label:e,value:e}})})),1)],1)],1):a("el-col",{attrs:{span:12}},[a("div",{staticClass:"block"},[a("el-form-item",{attrs:{prop:"rack"}},[a("span",{attrs:{slot:"label"},slot:"label"},[a("span",{staticClass:"text-red"},[e._v("*")]),e._v(" Rack total ")]),a("br"),a("div",{staticClass:"block"},[a("el-slider",{staticClass:"relative",attrs:{id:"rack-slider","show-input":"","input-size":"small"},model:{value:e.form.totalRack,callback:function(t){e.$set(e.form,"totalRack",t)},expression:"form.totalRack"}})],1)])],1)])]:e._e(),e.isBackboneSelection?[a("el-col",{attrs:{md:24,xl:12}},[a("div",{staticClass:"el-form-item is-required"},[a("label",{staticClass:"el-form-item__label",attrs:{for:"addressPoinB"}},[e._v(" From (A-end) ")]),a("autocomplete-google",{attrs:{size:"regular",id:"pointA"},on:{"place-changed":function(t){return e.handleAddressChanged(t,"a")}}})],1)]),a("el-col",{attrs:{md:24,xl:12}},[a("div",{staticClass:"el-form-item is-required"},[a("label",{staticClass:"el-form-item__label",attrs:{for:"addressPoinB"}},[e._v(" To (Z-end) ")]),a("autocomplete-google",{attrs:{size:"regular",id:"pointB"},on:{"place-changed":function(t){return e.handleAddressChanged(t,"b")}}})],1)])]:e._e(),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:"Message",prop:"message"}},[a("el-input",{class:{dark:e.dark},attrs:{type:"textarea",rows:"4"},model:{value:e.form.message,callback:function(t){e.$set(e.form,"message",t)},expression:"form.message"}})],1)],1),a("el-col",{attrs:{span:24}},[a("vue-recaptcha",{ref:"catpcha",attrs:{sitekey:e.siteKey,loadRecaptchaScript:!0},on:{verify:e.handleCatchaVerification,error:function(){return e.catchaVerified=!1},expired:function(){return e.catchaVerified=!1}}})],1)],2)],1),a("footer",{staticClass:"footer flex wrap justify-content-space-between pr0 pl6 mt4"},[a("small",{staticClass:"inline-block mt2 mb4"},[a("span",{staticClass:"text-red"},[e._v("*")]),e._v(" indicates required field ")]),a("div",[a("el-button",{staticClass:"mr2",attrs:{plain:"",type:"info"},on:{click:e.closeDialog}},[e._v("Cancel")]),a("el-button",{staticClass:"w-fit-content",attrs:{disabled:e.isFormUncomplete,type:"primary",plain:"",loading:e.isSendingData},on:{click:function(t){return e.submitForm("form")},keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")&&e._k(t.keyCode,"space",32,t.key,[" ","Spacebar"])?null:e.submitForm("form")}}},[e._v("Submit Request")])],1)])],1)},o=[],n=(a("99af"),a("4de4"),a("caad"),a("d81d"),a("b0c0"),a("b64b"),a("2532"),a("b85c")),r=(a("96cf"),a("1da1")),l=a("5530"),i=a("2f62"),c=a("9a1e"),u=a("4aec"),m=a("0316"),d=a("ceaf"),p=a("e096"),f=a("1b83"),b=a("fc4a"),g=a("ddbf"),y={components:{VueRecaptcha:p["a"],AutocompleteGoogle:b["a"]},data:function(){return{capacities:["1GB","10GB","100GB","Others"],loading:!1,siteKey:f["a"],isSendingData:!1,catchaVerified:null,form:{company:"",email:"",fullname:"",capacity:"",totalRack:0,message:"",address:{pointA:null,pointB:null}},formRules:{message:[],"address.fromA":[],"address.toB":[],fullname:[{required:!0,message:"Please input your full name",trigger:"blur"},{max:50,message:"Length should be max 50",trigger:["change","blur"]}],company:[{required:!0,message:"Company name is required",trigger:"blur"}],email:[{required:!0,message:"Please input your email",trigger:"blur"},{type:"email",required:!0,message:"Please input a valid email",trigger:"change"}],capacity:[{required:!0,message:"Please select the desired capacity",trigger:"change"}]}}},computed:Object(l["a"])({},Object(i["c"])({buyType:function(e){return e.buyType},dark:function(e){return e.isDark},focus:function(e){return e.map.focus}}),{isBackboneSelection:function(){return this.focus&&"backbone"==this.dialogTitle.toLowerCase()},isVisible:{get:function(){return this.$store.state.isBuyDialog},set:function(){return this.closeDialog()}},dialogTitle:function(){return this.buyType&&this.buyType.title?this.buyType.title:""},isFormUncomplete:function(){var e=this,t=Object.keys(this.form).filter((function(t){return!e.form[t]}));return!!(t.length&&"Datacenter"===this.dialogTitle&&t.includes("totalRack")||!this.catchaVerified||null==this.form.address.pointA||null==this.form.address.pointB)},customDialogClass:function(){return this.dark?"custom-dialog dark":"custom-dialog light"}}),watch:{isVisible:function(e){return e?this.setUserData():this.$refs.catpcha.reset()}},methods:{handleCatchaVerification:function(e){e&&(this.catchaVerified=!0)},setUserData:function(){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function t(){var a,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.$auth.user){t.next=2;break}return t.abrupt("return");case 2:return t.t0=c["b"],t.next=5,e.$auth.getUserID();case 5:return t.t1=t.sent,t.next=8,(0,t.t0)(t.t1);case 8:a=t.sent,a&&(e.loading=!0,s=a.user_metadata,e.form.fullname=s&&s.name?s.name:Object(g["a"])(a.name)?"":a.name,e.form.email=s&&s.email?s.email:a.email,e.form.company=s&&s.companyname?s.companyname:"",e.form.phonenumber=s&&s.phonenumber?s.phonenumber:{num:"",valid:null},e.loading=!1);case 10:case"end":return t.stop()}}),t)})))()},handleAddressChanged:function(e,t){switch(t){case"b":this.form.address.pointB=Object(l["a"])({},e);break;default:this.form.address.pointA=Object(l["a"])({},e);break}},sendBuyRequest:function(){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function t(){var a,s,o,r,i,c,m,p,f,b,g;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.isSendingData=!0,a=Object(l["a"])({cable:e.$store.state.map.currentSelection.name,type:e.dialogTitle},e.form),s=""!=a.message?'\n            <p style="font-size: 16px; color: #323232;"> Hi, '.concat(a.fullname," (").concat(a.email,') sent you a message: </p>\n            <br />\n            <p style="font-size: 16px; color: #323232; text-transform: capitalize;"> ').concat(a.message,' </p>\n            <br />\n            <p style="font-size: 16px; color: #323232;"> AI: asked to buy an amount of ').concat(a.capacity?a.capacity:a.totalRack+" rack total"," for ").concat(a.cable,"(").concat(a.type,") </p>"):'\n            <p style="font-size: 16px; color: #323232;"> Hi, '.concat(a.fullname," (").concat(a.email,') </p>\n            <br />\n            <p style="font-size: 16px; color: #323232;"> AI: asked to buy an amount of ').concat(a.capacity?a.capacity:a.totalRack+" rack total"," for ").concat(a.cable,"(").concat(a.type,") </p>"),a.address.pointA&&a.address.pointB&&"backbone"==e.dialogTitle.toLowerCase()){o="",r="",i=Object(n["a"])(a.address.pointA.address_components);try{for(i.s();!(c=i.n()).done;)m=c.value,m.types.includes("postal_code")&&(o=m.short_name)}catch(y){i.e(y)}finally{i.f()}p=Object(n["a"])(a.address.pointB.address_components);try{for(p.s();!(f=p.n()).done;)b=f.value,b.types.includes("postal_code")&&(r=b.short_name)}catch(y){p.e(y)}finally{p.f()}s=""!=a.message?'\n            <p style="font-size: 16px; color: #323232;"> Hi, '.concat(a.fullname," (").concat(a.email,') sent you a message: </p>\n            <br />\n            <p style="font-size: 16px; color: #323232; text-transform: capitalize;"> ').concat(a.message,' </p>\n            <br />\n            <p style="font-size: 16px; color: #323232;"> AI: asked to buy an amount of ').concat(a.capacity?a.capacity:a.totalRack+" rack total"," for ").concat(a.cable,"(").concat(a.type,"). From pointA ").concat(a.address.pointA.fullAddress).concat(o&&""!=o?"("+o+")":""," to pointB ").concat(a.address.pointB.fullAddress).concat(r&&""!=r?"("+r+")":""," </p>"):'\n              <p style="font-size: 16px; color: #323232;"> Hi, '.concat(a.fullname," (").concat(a.email,') </p>\n              <br />\n              <p style="font-size: 16px; color: #323232;"> AI: asked to buy an amount of ').concat(a.capacity?a.capacity:a.totalRack+" rack total"," for ").concat(a.cable,"(").concat(a.type,"). From pointA ").concat(a.address.pointA.fullAddress).concat(o&&""!=o?"("+o+")":""," to pointB ").concat(a.address.pointB.fullAddress).concat(r&&""!=r?"("+r+")":"","</p>\n              ")}return t.t0=u["d"],t.t1=a.email,t.t2=a.phonenumber,t.t3=s,t.t4=e.focus.id,t.next=11,e.$auth.getUserID();case 11:return t.t5=t.sent,t.t6=Object(d["a"])(e.focus.type),t.t7={email:t.t1,phone:t.t2,message:t.t3,elemnt:t.t4,user_id:t.t5,t:t.t6},t.next=16,(0,t.t0)(t.t7);case 16:g=t.sent,g&&g.t&&"error"!=g.t&&e.closeDialog(),e.isSendingData=!1;case 19:case"end":return t.stop()}}),t)})))()},submitForm:function(e){var t=this;this.$refs[e].validate((function(e){if(!e)return!1;t.sendBuyRequest()}))},closeDialog:function(){this.$store.commit("".concat(m["j"]),!1),this.$refs.form.resetFields(),this.catchaVerified=null,this.form={company:"",email:"",message:"",fullname:"",capacity:"",totalRack:0,address:{pointA:null,pointB:null}},this.$store.commit("".concat(m["a"]),null)}}},h=y,k=a("2877"),v=Object(k["a"])(h,s,o,!1,null,null,null);t["default"]=v.exports},ddbf:function(e,t,a){"use strict";function s(e){var t=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return t.test(String(e).toLowerCase())}a.d(t,"a",(function(){return s}))}}]);
//# sourceMappingURL=chunk-ca310786.54b6971e.js.map
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-815a7674"],{"13d5":function(e,t,a){"use strict";var s=a("23e7"),r=a("d58f").left,n=a("a640"),i=a("ae40"),o=n("reduce"),l=i("reduce",{1:0});s({target:"Array",proto:!0,forced:!o||!l},{reduce:function(e){return r(this,e,arguments.length,arguments.length>1?arguments[1]:void 0)}})},"3ec2":function(e,t,a){"use strict";a.d(t,"b",(function(){return m})),a.d(t,"a",(function(){return g}));a("99af"),a("caad"),a("a15b"),a("d3b7"),a("ac1f"),a("6062"),a("2532"),a("3ca3"),a("5319"),a("1276"),a("498a"),a("ddb0");var s=a("5530"),r=a("2909"),n=a("2c8b"),i=a("1315"),o={title:"Capacity Buy Request",date:"",small:"A Capacity purchase request has been received from the following user:",reference:"",Organization:["company",""],Name:["fullname",""],"E-mail address":["email",""],small_two:"The user has the following request:",Element:["element",""],Type:["type",""],"Capacity requirement":["capacity",0],From:["address.pointA",""],To:["address.pointB",""],Message:["message",""]},l={title:"Transit Buy Request",date:"",small:"A Transit purchase request has been received from the following user:",reference:"",Organization:["company",""],Name:["fullname",""],"E-mail address":["email",""],small_two:"The user has the following request:",Element:["element",""],Type:["type",""],"Location(s)":["transitIP",""],"Transit Capacity":["capacity",0],Message:["message",""]},c={title:"Data Center Buy Request",date:"",small:"A Data Center purchase request has been received from the following user:",reference:"",Organization:["company",""],Name:["fullname",""],"E-mail address":["email",""],small_two:"The user has the following request:",Element:["element",""],Type:["type",""],"Rack Total":["totalRack",0],"Custom Request":["custom",!1],Message:["message",""]},u={title:"General Buy Request",date:"",small:"A (general) purchase request has been received from the following user:",reference:"",Organization:["company",""],Name:["fullname",""],"E-mail address":["email",""],small_two:"The user has the following request:",Element:["element",""],Type:["type",""],Message:["message",""]};function p(e,t){var a=e.split(t);return a[1]}function d(e,t){var a=p(e.message,t).split('<p style="font-size: 16px; color: #323232; text-transform: capitalize;">'),s=a[1].split("asked to buy an amount")[1].split("for"),r=s[0].split("of")[1],n=s[1].split(".")[0].split("("),i=a[1].split("From pointA"),o="";if(n.length>=3?n=n[2].split(")")[0]:2==n.length&&(n=n[1].split(")")[0]),n=n.toLowerCase(),"backbone"==n){var l=i[1].split("to");o="<strong>Capacity requirement:</strong> ".concat(r,"<p><strong>From:</strong> ").concat(l[1].replace("pointB",""),"</p> <p> <strong>To:</strong> ").concat(l[0].replace("to",""),"</p>")}else if("datacenter"==n){var c=i[0].split("for")[1].split("</p>")[0].split("(")[0];o="<strong>Data Center Space</strong> <br> <strong>Facility:</strong> ".concat(c," <br> <strong> Rack total: </strong> ").concat(r.split("rack total")[0])}return{request:o,rgDate:e.rgDate,status:e.status,message:e.message,subject:"".concat(p(e.message,t).split("AI: asked to buy an amount of")[1].split(").")[0]+")")}}function f(e,t){var a=p(e.message,t),s=e.message.includes("Custom Request: true"),r=a.split("Type:")[1].split('<p style="font-size: 14px">')[1],n=a.split("Type:")[1].split('<p style="font-size: 14px">')[1],i=p(e.message,t).split("Element:")[1].split("<p style")[0],o=e.message.split("Buy Request")[0].split('">')[1].trim().replace(" ","").toLowerCase();if("datacenter"==o)s?(r="<strong>Data Center Space </strong> <br> <strong> Facility: </strong> ".concat(i," <br> This request has custom requirements. <br> Contact Infrapedia's team for further assistance"),n="Data Center Space Custom Request for ".concat(i.trim())):(r="<strong>Data Center Space</strong> <br> <strong> Facility: </strong> ".concat(i," <strong>Rack Total: </strong> ").concat(r.split(":")[1].replace("</p>","")),n="".concat(n.split(":")[1].replace("</p>","")," racks total for ").concat(i.trim()));else if("capacity"==o){var l=e.message.split("From: ")[1].split("</p>")[0],c=e.message.split("To: ")[1].split("</p>")[0];r="<strong>Capacity requirement:</strong> ".concat(r.split(":")[1].replace("</p>",""),"<p><strong>From:</strong> ").concat(l,"</p> <p> <strong>To:</strong> ").concat(c,"</p>"),n="".concat(n.split(":")[1].replace("</p>","")," for ").concat(i.trim())}else if("transit"==o){var u=e.message.split("Transit Capacity: ")[1].split("</p>")[0];r="<strong>IP Transit Capacity: </strong> ".concat(u," <br> <strong> Facility: </strong> ").concat(i),n="".concat(u," for  ").concat(p(e.message,t).split("Element:")[1].split("<p style")[0].replace("</p>","").trim())}else{if("general"!=o)return!1;r="<strong> This a general request for: </strong> ".concat(i," <br> Contact Infrapedia's team for further assistance"),n="General request for ".concat(i.trim())}return{request:r,subject:n,rgDate:e.rgDate,status:e.status,message:e.message}}function m(e){var t={old:"sent you a message: </p>",new:"The user has the following request:</p>"};return p(e.message,t.new)?f(e,t.new):!!p(e.message,t.old)&&d(e,t.old)}function h(e){var t=e.data,a=e.format,s=e.userID,o=Object(n["a"])(i["DateTime"].local()),l=new Set,c=null,p=null;for(var d in"backbone"==t.buyType.toLowerCase()&&t.address.pointA&&t.address.pointB&&(c=t.address.pointA,p=t.address.pointB),a)for(var f in t)"string"==typeof u[d]?"date"==d?l.add('<p style="font-size: 16px;"> Date: '.concat(o,"</p>")):"title"==d?l.add('<h2 style="font-size= 24px;">'.concat(a[d],"</h2><br/>")):"reference"==d?l.add('<p style="font-size: 14px;">Reference: '.concat(s,"</p>")):l.add('<p style="font-size: 14px; font-weight: bold; margin-top: 3rem;">'.concat(a[d],"</p>")):a[d][0]==f?"Message"==d?l.add('<p style="font-size: 14px;">'.concat(d,':</p> <p style="font-size: 14px; white-space: pre-wrap;"> ').concat(t[f],"</p>")):l.add('<p style="font-size: 14px">'.concat(d,": ").concat(t[f],"</p>")):"From"!=d&&"To"!=d||l.add('<p style="font-size: 14px">'.concat(d,": ").concat("To"==d?p:c,"</p>"));return"".concat(Object(r["a"])(l).join(""))}function g(e){var t=e.data,a=e.userID,r="",n={data:t,userID:a};switch(t.buyType.toLocaleLowerCase()){case"transit":r=h(Object(s["a"])(Object(s["a"])({},n),{},{format:l}));break;case"datacenter":r=h(Object(s["a"])(Object(s["a"])({},n),{},{format:c}));break;case"other":r=h(Object(s["a"])(Object(s["a"])({},n),{},{format:u}));break;default:r=h(Object(s["a"])(Object(s["a"])({},n),{},{format:o}));break}return r}},6062:function(e,t,a){"use strict";var s=a("6d61"),r=a("6566");e.exports=s("Set",(function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}}),r)},6566:function(e,t,a){"use strict";var s=a("9bf2").f,r=a("7c73"),n=a("e2cc"),i=a("0366"),o=a("19aa"),l=a("2266"),c=a("7dd0"),u=a("2626"),p=a("83ab"),d=a("f183").fastKey,f=a("69f3"),m=f.set,h=f.getterFor;e.exports={getConstructor:function(e,t,a,c){var u=e((function(e,s){o(e,u,t),m(e,{type:t,index:r(null),first:void 0,last:void 0,size:0}),p||(e.size=0),void 0!=s&&l(s,e[c],e,a)})),f=h(t),g=function(e,t,a){var s,r,n=f(e),i=b(e,t);return i?i.value=a:(n.last=i={index:r=d(t,!0),key:t,value:a,previous:s=n.last,next:void 0,removed:!1},n.first||(n.first=i),s&&(s.next=i),p?n.size++:e.size++,"F"!==r&&(n.index[r]=i)),e},b=function(e,t){var a,s=f(e),r=d(t);if("F"!==r)return s.index[r];for(a=s.first;a;a=a.next)if(a.key==t)return a};return n(u.prototype,{clear:function(){var e=this,t=f(e),a=t.index,s=t.first;while(s)s.removed=!0,s.previous&&(s.previous=s.previous.next=void 0),delete a[s.index],s=s.next;t.first=t.last=void 0,p?t.size=0:e.size=0},delete:function(e){var t=this,a=f(t),s=b(t,e);if(s){var r=s.next,n=s.previous;delete a.index[s.index],s.removed=!0,n&&(n.next=r),r&&(r.previous=n),a.first==s&&(a.first=r),a.last==s&&(a.last=n),p?a.size--:t.size--}return!!s},forEach:function(e){var t,a=f(this),s=i(e,arguments.length>1?arguments[1]:void 0,3);while(t=t?t.next:a.first){s(t.value,t.key,this);while(t&&t.removed)t=t.previous}},has:function(e){return!!b(this,e)}}),n(u.prototype,a?{get:function(e){var t=b(this,e);return t&&t.value},set:function(e,t){return g(this,0===e?0:e,t)}}:{add:function(e){return g(this,e=0===e?0:e,e)}}),p&&s(u.prototype,"size",{get:function(){return f(this).size}}),u},setStrong:function(e,t,a){var s=t+" Iterator",r=h(t),n=h(s);c(e,t,(function(e,t){m(this,{type:s,target:e,state:r(e),kind:t,last:void 0})}),(function(){var e=n(this),t=e.kind,a=e.last;while(a&&a.removed)a=a.previous;return e.target&&(e.last=a=a?a.next:e.state.first)?"keys"==t?{value:a.key,done:!1}:"values"==t?{value:a.value,done:!1}:{value:[a.key,a.value],done:!1}:(e.target=void 0,{value:void 0,done:!0})}),a?"entries":"values",!a,!0),u(t)}}},"6d61":function(e,t,a){"use strict";var s=a("23e7"),r=a("da84"),n=a("94ca"),i=a("6eeb"),o=a("f183"),l=a("2266"),c=a("19aa"),u=a("861d"),p=a("d039"),d=a("1c7e"),f=a("d44e"),m=a("7156");e.exports=function(e,t,a){var h=-1!==e.indexOf("Map"),g=-1!==e.indexOf("Weak"),b=h?"set":"add",y=r[e],v=y&&y.prototype,k=y,x={},w=function(e){var t=v[e];i(v,e,"add"==e?function(e){return t.call(this,0===e?0:e),this}:"delete"==e?function(e){return!(g&&!u(e))&&t.call(this,0===e?0:e)}:"get"==e?function(e){return g&&!u(e)?void 0:t.call(this,0===e?0:e)}:"has"==e?function(e){return!(g&&!u(e))&&t.call(this,0===e?0:e)}:function(e,a){return t.call(this,0===e?0:e,a),this})};if(n(e,"function"!=typeof y||!(g||v.forEach&&!p((function(){(new y).entries().next()})))))k=a.getConstructor(t,e,h,b),o.REQUIRED=!0;else if(n(e,!0)){var C=new k,R=C[b](g?{}:-0,1)!=C,q=p((function(){C.has(1)})),T=d((function(e){new y(e)})),O=!g&&p((function(){var e=new y,t=5;while(t--)e[b](t,t);return!e.has(-0)}));T||(k=t((function(t,a){c(t,k,e);var s=m(new y,t,k);return void 0!=a&&l(a,s[b],s,h),s})),k.prototype=v,v.constructor=k),(q||O)&&(w("delete"),w("has"),h&&w("get")),(O||R)&&w(b),g&&v.clear&&delete v.clear}return x[e]=k,s({global:!0,forced:k!=y},x),f(k,e),g||a.setStrong(k,e,h),k}},a1bb:function(e,t,a){"use strict";a.r(t);var s,r,n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{visible:e.isVisible,width:"80%",top:"12vh","custom-class":e.customDialogClass,"close-on-click-modal":!1},on:{"update:visible":function(t){e.isVisible=t}}},[a("header",{staticClass:"header p0 no-selectable",attrs:{slot:"title"},slot:"title"},[a("h1",{staticClass:"inline-block font-semibold fs-xlarge"},[e._v(" Buy Now! - "),a("span",{staticClass:"capitalize"},[e._v(e._s(e.dialogTitle))])])]),a("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"form",staticClass:"pr2 pl2",attrs:{model:e.form,rules:e.formRules}},[a("el-row",{attrs:{gutter:15}},[a("el-col",{attrs:{xs:24,sm:12,md:24,lg:24,xl:12}},[a("el-form-item",{attrs:{label:"Company name",prop:"company"}},[a("el-input",{class:{dark:e.dark},model:{value:e.form.company,callback:function(t){e.$set(e.form,"company",t)},expression:"form.company"}})],1)],1),a("el-col",{attrs:{xs:24,sm:12,md:24,lg:24,xl:12}},[a("el-form-item",{attrs:{label:"Full Name",prop:"fullname"}},[a("el-input",{class:{dark:e.dark},model:{value:e.form.fullname,callback:function(t){e.$set(e.form,"fullname",t)},expression:"form.fullname"}})],1)],1)],1),a("el-row",{attrs:{gutter:30}},[a("el-col",{attrs:{xs:24,sm:24,md:24,lg:12,xl:12}},[a("el-form-item",{attrs:{label:"Email",prop:"email"}},[a("el-input",{class:{dark:e.dark},attrs:{type:"email"},model:{value:e.form.email,callback:function(t){e.$set(e.form,"email",t)},expression:"form.email"}})],1)],1),"Other"!==e.dialogTitle?["Datacenter"!==e.dialogTitle?a("el-col",{attrs:{md:24,lg:12}},[a("el-form-item",{attrs:{label:"Capacity",prop:"capacity"}},[a("el-select",{staticClass:"w-fit-full",class:{dark:e.dark},attrs:{filterable:"",placeholder:"Select an option"},model:{value:e.form.capacity,callback:function(t){e.$set(e.form,"capacity",t)},expression:"form.capacity"}},e._l(e.capacities,(function(e){return a("el-option",{key:e,attrs:{label:e,value:e}})})),1)],1)],1):a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{required:e.isRackRequired,prop:"totalRack",label:"Rack total"}},[a("div",{staticClass:"w-fit-full inline-block"},[a("div",{staticClass:"block"},[a("el-slider",{staticClass:"relative",attrs:{id:"rack-slider",disabled:e.isCustomRequest,"show-input":"","input-size":"small"},model:{value:e.form.totalRack,callback:function(t){e.$set(e.form,"totalRack",t)},expression:"form.totalRack"}})],1),a("el-checkbox",{on:{change:e.resetRackTotal},model:{value:e.isCustomRequest,callback:function(t){e.isCustomRequest=t},expression:"isCustomRequest"}},[e._v(" Custom request ")])],1)])],1)]:e._e(),e.isBackboneSelection?[a("el-col",{attrs:{md:24,xl:12}},[a("el-form-item",{ref:"pointA",attrs:{label:"From (A-end)",required:"",prop:"address.pointA"}},[a("point-field",{attrs:{id:"pointA"},on:{"place-changed":function(t){return e.handleAddressChanged(t,"a")}}})],1)],1),a("el-col",{attrs:{md:24,xl:12}},[a("el-form-item",{ref:"pointB",attrs:{label:"To (Z-end)",required:"",prop:"address.pointB"}},[a("point-field",{attrs:{id:"pointB"},on:{"place-changed":function(t){return e.handleAddressChanged(t,"b")}}})],1)],1)]:e._e(),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:"Message",prop:"message",required:e.isOthersCapacitySelection||"Other"==e.dialogTitle||e.isCustomRequest}},[e.isOthersCapacitySelection||e.isCustomRequest?a("span",{staticClass:"error-message"},[e._v(" - "+e._s(e.messageWhenRequired)+" ")]):e._e(),a("el-input",{class:{dark:e.dark},attrs:{type:"textarea",rows:"4"},model:{value:e.form.message,callback:function(t){e.$set(e.form,"message",t)},expression:"form.message"}})],1)],1),a("el-col",{attrs:{span:24}},[a("vue-recaptcha",{ref:"catpcha",attrs:{sitekey:e.siteKey,loadRecaptchaScript:!0},on:{verify:e.handleCatchaVerification,error:function(){return e.catchaVerified=!1},expired:function(){return e.catchaVerified=!1}}})],1)],2)],1),a("footer",{staticClass:"footer flex wrap justify-content-space-between pr0 pl6 mt4"},[a("small",{staticClass:"inline-block mt2 mb4"},[a("span",{staticClass:"text-red"},[e._v("*")]),e._v(" indicates required field ")]),a("div",[a("el-button",{staticClass:"mr2",attrs:{plain:"",type:"info"},on:{click:e.closeDialog}},[e._v("Cancel")]),a("el-button",{staticClass:"w-fit-content",attrs:{disabled:!e.catchaVerified,type:"primary",plain:"",loading:e.isSendingData},on:{click:function(t){return e.submitForm("form")},keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")&&e._k(t.keyCode,"space",32,t.key,[" ","Spacebar"])?null:e.submitForm("form")}}},[e._v("Submit Request")])],1)])],1)},i=[],o=(a("99af"),a("a630"),a("caad"),a("d81d"),a("13d5"),a("b0c0"),a("2532"),a("3ca3"),a("498a"),a("2909")),l=(a("96cf"),a("1da1")),c=a("5530"),u=a("2f62"),p=a("9a1e"),d=a("780a"),f=a("a4dc"),m=function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(t){var a,n,i,o,l,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a=t.user_id,n=t.t,i=t.elemnt,o=t.email,l=t.message,s="".concat(f["a"].url,"/auth/message/send"),r=new FormData,r.append("t",n),r.append("email",o),r.append("elemnt",i),r.append("message",l),e.next=9,d["a"].post(s,r,{withCredentials:!0,headers:{userid:a,Authorization:"Bearer "+f["a"].bearer()}});case 9:return c=e.sent,e.abrupt("return",c);case 11:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),h=a("0316"),g=a("ceaf"),b=a("e096"),y=a("1b83"),v=a("ddbf"),k=a("3ec2"),x=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-popover",{attrs:{placement:"bottom-start",width:"420",transition:"el-zoom-in-top",trigger:"manual",value:e.isResultsVisible},on:{"update:value":function(t){e.isResultsVisible=t}}},[a("el-card",{staticClass:"p0 no-border",attrs:{shadow:"never"}},[a("ul",{staticClass:"w-fit-full h80 no-outline overflow-y-auto",attrs:{role:"list"}},[e._l(e.searchResults.r,(function(t,s){return a("li",{key:s+t,staticClass:"pt2 pb2 pr5 pl5 cursor-pointer seamless-hoverbg no-outline",class:{dark:e.dark,light:!e.dark},attrs:{tabindex:"0",role:"listitem"},on:{click:function(a){return e.handlePlaceSelection(t)},keyup:function(a){return!a.type.indexOf("key")&&e._k(a.keyCode,"enter",13,a.key,"Enter")&&e._k(a.keyCode,"space",32,a.key,[" ","Spacebar"])?null:e.handlePlaceSelection(t)}}},[t.address&&t.address.length&&""!==t.address[0].city?a("div",{staticClass:"inline-block"},[e._v(" "+e._s(t.name)+" in "),e._l(t.address,(function(t,s){return a("small",{key:t.state+s},[e._v(" "+e._s(t.city)+", "+e._s(t.state)+"; ")])}))],2):a("span",[e._v(" "+e._s(t.name)+" ")]),e._v(" - "),a("small",{staticClass:"capitalize"},[e._v(e._s(e.getResultType(t)))])])})),e.searchResults.r.length?a("el-divider",{staticClass:"m0"}):e._e(),e._l(e.searchResults.places,(function(t,s){return a("li",{key:s,staticClass:"pt2 pb2 pr5 pl5 cursor-pointer seamless-hoverbg no-outline",class:{dark:e.dark,light:!e.dark},attrs:{tabindex:"0",role:"listitem"},on:{click:function(a){return e.handlePlaceSelection(t)},keyup:function(a){return!a.type.indexOf("key")&&e._k(a.keyCode,"enter",13,a.key,"Enter")&&e._k(a.keyCode,"space",32,a.key,[" ","Spacebar"])?null:e.handlePlaceSelection(t)}}},[a("span",[e._v(" "+e._s(t.name)+" ")])])}))],2)]),a("div",{attrs:{slot:"reference",role:"search"},slot:"reference"},[a("el-input",{class:{dark:e.dark},attrs:{clearable:"",placeholder:""},on:{clear:e.handleClear,input:e.getQueryData},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}},[a("fa",{staticClass:"mt3 ml1 hidden-md-and-down",attrs:{slot:"prefix",icon:["fas","search"]},slot:"prefix"})],1)],1)],1)},w=[],C=(a("ac1f"),a("841c"),a("33b5")),R=a("f867"),q={data:function(){return{search:"",searchResults:{r:[],places:[]},isSelection:!1,isResultsVisible:!1}},computed:{dark:function(){return this.$store.state.isDark}},mounted:function(){document.addEventListener("click",this.close)},beforeDestroy:function(){document.removeEventListener("click",this.close)},methods:{getQueryData:Object(C["a"])(function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(t){var a,s,r,n,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!(t.length<=1)){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,Object(R["d"])(t);case 4:return a=e.sent,s=a.data,e.next=8,Object(R["c"])(t);case 8:return r=e.sent,n=r.data,e.next=12,this.$store.dispatch("getSearchQueryDataMapbox",t);case 12:i=e.sent,this.searchResults.places=i.features.map((function(e){return e.name=e.place_name,e})),this.searchResults.r=[].concat(Object(o["a"])(s),Object(o["a"])(n)),this.isResultsVisible=!0;case 16:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}(),320),handlePlaceSelection:function(e){var t=this,a=e.name;e.t&&(a="".concat(a," (").concat(e.t,")")),this.$emit("place-changed",a),this.search=a,this.isSelection=!0,setTimeout((function(){return t.isSelection=!1}),520),this.close()},getResultType:function(e){return e.t},handleClear:function(){this.$emit("place-changed","")},close:function(){this.searchResults={r:[],places:[]},this.isResultsVisible=!1}}},T=q,O=a("2877"),_=Object(O["a"])(T,x,w,!1,null,null,null),D=_.exports,j=a("5c49"),S={components:{VueRecaptcha:b["default"],"point-field":D},data:function(){return{capacities:["1Gbps","10Gbps","100Gbps","Fiber","Other"],loading:!1,facsList:[],isSendingData:!1,catchaVerified:null,isCustomRequest:!1,isLoadingFacs:!1,form:{company:"",email:"",fullname:"",capacity:"",totalRack:0,message:"",transitIP:"",address:{pointA:null,pointB:null}},formRules:{message:[],"address.pointA":[{required:!0,message:"Please input an A point",trigger:["blur","change"]}],"address.pointB":[{required:!0,message:"Please input a Z point",trigger:["blur","change"]}],fullname:[{required:!0,message:"Please input your full name",trigger:"blur"},{max:50,message:"Length should be max 50",trigger:["change","blur"]}],company:[{required:!0,message:"Company name is required",trigger:["blur","change"]}],email:[{required:!0,message:"Please input your email",trigger:"blur"},{type:"email",required:!0,message:"Please input a valid email",trigger:"change"}],capacity:[{required:!0,message:"Please select the desired capacity",trigger:"change"}],transitIP:[]}}},computed:Object(c["a"])(Object(c["a"])({},Object(u["c"])({buyType:function(e){return e.buyType},dark:function(e){return e.isDark},focus:function(e){return e.map.focus}})),{},{siteKey:function(){return y["a"]},messageWhenRequired:function(){if(""===this.dialogTitle)return"";var e="Please, describe your Capacity requirement in more detail in the Message field below.";return"Transit"==this.dialogTitle.trim()?e="Please, describe your Transit requirement in more detail in the Message field below.":"Datacenter"==this.dialogTitle.trim()&&this.isCustomRequest&&(e="Please, describe your custom request details in the Message field below."),e},isRackRequired:function(){return!this.isCustomRequest},isOthersCapacitySelection:function(){return"Other"==this.form.capacity},isBackboneSelection:function(){return this.focus&&"backbone"==this.dialogTitle.toLowerCase()},isTransitSelection:function(){return this.focus&&"transit"==this.dialogTitle.toLowerCase()},isVisible:{get:function(){return this.$store.state.isBuyDialog},set:function(){return this.closeDialog()}},dialogTitle:function(){return this.buyType&&this.buyType.title?this.buyType.title:""},customDialogClass:function(){return this.dark?"custom-dialog dark":"custom-dialog light"}}),watch:{isVisible:function(e){e?(this.setUserData(),this.isTransitSelection?this.capacities=["1Gbps","10Gbps","100Gbps","Other"]:this.capacities=["1Gbps","10Gbps","100Gbps","Fiber","Other"]):(this.$refs.catpcha.reset(),this.isCustomRequest=!1)}},methods:{loadFacsSearch:function(e){var t=this;return Object(l["a"])(regeneratorRuntime.mark((function a(){var s;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(!(e.length<=0)){a.next=2;break}return a.abrupt("return");case 2:return t.isLoadingFacs=!0,a.t0=j["f"],a.next=6,t.$auth.getUserID();case 6:return a.t1=a.sent,a.t2=e,a.t3={user_id:a.t1,s:a.t2},a.next=11,(0,a.t0)(a.t3);case 11:s=a.sent,s&&s.data&&(t.facsList=s.data.reduce((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Array.from(t.facsList),a=arguments.length>1?arguments[1]:void 0;return e.map((function(e){return e._id})).includes(a._id)?e:[].concat(Object(o["a"])(e),[a])}),[])),t.isLoadingFacs=!1;case 14:case"end":return a.stop()}}),a)})))()},resetRackTotal:function(e){e&&(this.form.totalRack=0)},handleCatchaVerification:function(e){e&&(this.catchaVerified=!0)},setUserData:function(){var e=this;return Object(l["a"])(regeneratorRuntime.mark((function t(){var a,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.$auth.user){t.next=2;break}return t.abrupt("return");case 2:return t.t0=p["b"],t.next=5,e.$auth.getUserID();case 5:return t.t1=t.sent,t.next=8,(0,t.t0)(t.t1);case 8:a=t.sent,a&&(e.loading=!0,s=a.user_metadata,e.form.fullname=s&&s.name?s.name:Object(v["a"])(a.name)?"":a.name,e.form.email=s&&s.email?s.email:a.email,e.form.company=s&&s.companyname?s.companyname:"",e.form.phonenumber=s&&s.phonenumber?s.phonenumber:{num:"",valid:null},e.loading=!1);case 10:case"end":return t.stop()}}),t)})))()},handleAddressChanged:function(e,t){switch(t){case"b":this.form.address.pointB=e,this.$refs.pointB.clearValidate();break;default:this.form.address.pointA=e,this.$refs.pointA.clearValidate();break}},sendBuyRequest:function(){var e=this;return Object(l["a"])(regeneratorRuntime.mark((function t(){var a,s,r,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.isSendingData=!0,a=Object(c["a"])({element:e.$store.state.map.currentSelection.name,type:e.focus.type.toLowerCase(),custom:e.isCustomRequest,buyType:e.dialogTitle},e.form),t.next=4,e.$auth.getUserID();case 4:return s=t.sent,r=Object(k["a"])({data:a,userID:s}),t.next=8,m({email:a.email,message:r,user_id:s,elemnt:e.focus.id,t:Object(g["a"])(e.focus.type)});case 8:n=t.sent,n&&n.t&&"error"!=n.t&&e.closeDialog(),e.isSendingData=!1;case 11:case"end":return t.stop()}}),t)})))()},submitForm:function(e){var t=this;this.$refs[e].validate((function(e){if(!e)return!1;t.sendBuyRequest()}))},closeDialog:function(){this.$store.commit("".concat(h["j"]),!1),this.$refs.form.resetFields(),this.catchaVerified=null,this.form={company:"",email:"",message:"",fullname:"",capacity:"",totalRack:0,address:{pointA:null,pointB:null}},this.$store.commit("".concat(h["a"]),null)}}},z=S,E=Object(O["a"])(z,n,i,!1,null,null,null);t["default"]=E.exports},bb2f:function(e,t,a){var s=a("d039");e.exports=!s((function(){return Object.isExtensible(Object.preventExtensions({}))}))},ceaf:function(e,t,a){"use strict";a.d(t,"a",(function(){return n}));a("caad"),a("2532");var s=a("b85c"),r=[{value:1,t:["submarine","cable","subsea","terrestrial-network"]},{value:2,t:["cls"]},{value:3,t:["fac","facility","facilities","facs","datacenters","data centers"]},{value:4,t:["ixp","ixps"]},{value:5,t:[]},{value:6,t:["net","networks","network"]},{value:7,t:["org","organizations"]}];function n(e){var t,a=Object(s["a"])(r);try{for(a.s();!(t=a.n()).done;){var n=t.value;if(n.t.includes(e))return n.value}}catch(i){a.e(i)}finally{a.f()}}},d58f:function(e,t,a){var s=a("1c0b"),r=a("7b0b"),n=a("44ad"),i=a("50c4"),o=function(e){return function(t,a,o,l){s(a);var c=r(t),u=n(c),p=i(c.length),d=e?p-1:0,f=e?-1:1;if(o<2)while(1){if(d in u){l=u[d],d+=f;break}if(d+=f,e?d<0:p<=d)throw TypeError("Reduce of empty array with no initial value")}for(;e?d>=0:p>d;d+=f)d in u&&(l=a(l,u[d],d,c));return l}};e.exports={left:o(!1),right:o(!0)}},ddbf:function(e,t,a){"use strict";function s(e){var t=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return t.test(String(e).toLowerCase())}a.d(t,"a",(function(){return s}))},f183:function(e,t,a){var s=a("d012"),r=a("861d"),n=a("5135"),i=a("9bf2").f,o=a("90e3"),l=a("bb2f"),c=o("meta"),u=0,p=Object.isExtensible||function(){return!0},d=function(e){i(e,c,{value:{objectID:"O"+ ++u,weakData:{}}})},f=function(e,t){if(!r(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!n(e,c)){if(!p(e))return"F";if(!t)return"E";d(e)}return e[c].objectID},m=function(e,t){if(!n(e,c)){if(!p(e))return!0;if(!t)return!1;d(e)}return e[c].weakData},h=function(e){return l&&g.REQUIRED&&p(e)&&!n(e,c)&&d(e),e},g=e.exports={REQUIRED:!1,fastKey:f,getWeakData:m,onFreeze:h};s[c]=!0}}]);
//# sourceMappingURL=chunk-815a7674.ac718ebe.js.map
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-72d7424a"],{c355:function(t,e,i){},cbc5:function(t,e,i){"use strict";var n=i("c355"),s=i.n(n);s.a},e67d:function(t,e){function i(t){return"function"===typeof t.value||(console.warn("[Vue-click-outside:] provided expression",t.expression,"is not a function."),!1)}function n(t,e){if(!t||!e)return!1;for(var i=0,n=e.length;i<n;i++)try{if(t.contains(e[i]))return!0;if(e[i].contains(t))return!1}catch(s){return!1}return!1}function s(t){return"undefined"!==typeof t.componentInstance&&t.componentInstance.$isServer}t.exports={bind:function(t,e,r){if(!i(e))return;function l(e){if(r.context){var i=e.path||e.composedPath&&e.composedPath();i&&i.length>0&&i.unshift(e.target),t.contains(e.target)||n(r.context.popupItem,i)||t.__vueClickOutside__.callback(e)}}t.__vueClickOutside__={handler:l,callback:e.value};const a="ontouchstart"in document.documentElement?"touchstart":"click";!s(r)&&document.addEventListener(a,l)},update:function(t,e){i(e)&&(t.__vueClickOutside__.callback=e.value)},unbind:function(t,e,i){const n="ontouchstart"in document.documentElement?"touchstart":"click";!s(i)&&t.__vueClickOutside__&&document.removeEventListener(n,t.__vueClickOutside__.handler),delete t.__vueClickOutside__}}},ead0:function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("el-popover",{directives:[{name:"click-outside",rawName:"v-click-outside",value:t.closeMenu,expression:"closeMenu"}],attrs:{"visible-arrow":!1,placement:"bottom-end",width:"220",transition:"el-zoom-in-top",trigger:"manual"},model:{value:t.isVisible,callback:function(e){t.isVisible=e},expression:"isVisible"}},[i("header",{staticClass:"header h8 flex justify-content-space-between pr7 pl6 pt2 pb2 align-items-center",class:{dark:t.dark,light:!t.dark}},[i("strong",{staticClass:"fs-regular truncate"},[t._v(t._s(t.userName))]),i("span",{staticClass:"fs-regular cursor-pointer",on:{click:function(e){return t.toggleVisibility(!1)}}},[i("fa",{attrs:{icon:["fas","times"]}})],1)]),i("ul",{staticClass:"p1 h-fit",class:{dark:t.dark,light:!t.dark}},[i("li",{staticClass:"w-fit-full"},[i("el-button",{staticClass:"inline-block color-inherit w-fit-full p0",attrs:{type:"text"},on:{click:function(e){return t.toggleVisibility(!1)}}},[i("router-link",{staticClass:"color-inherit pl4 pr4 inline-block underline-hover h8 flex align-items-center",attrs:{to:t.currentRoute.to}},[t._v(" "+t._s(t.currentRoute.label)+" ")])],1)],1),"/app"!=t.currentRoute.to?i("li",{staticClass:"w-fit-full"},[i("router-link",{staticClass:"el-button h10 pl4 pr4 el-button--text color-inherit w-fit-full text-left inline-block underline-hover",attrs:{to:"/user/profile"}},[t._v(" Profile ")])],1):t._e(),i("li",{staticClass:"w-fit-full h10"},[i("el-button",{staticClass:"inline-block capitalize w-fit-full text-left pl4 pr4 color-inherit",attrs:{type:"text"},on:{click:t.toggleDarkMode}},[i("span",{staticClass:"mode-label dark",class:{active:t.dark}},[t._v(" Dark Mode ")]),t._v(" / "),i("span",{staticClass:"mode-label light",class:{active:!t.dark}},[t._v("Light Mode ")])])],1),i("el-divider",{staticClass:"mt2 mb2"}),i("div",{staticClass:"list-wrapper flex column"},t._l(t.infoMenuLinks.info,(function(e,n){return i("li",{key:n,staticClass:"w-fit-full h10",attrs:{"data-index-link":e.menu.order}},[e.router?i("router-link",{staticClass:"el-button pl4 pr4 el-button--text inline-block w-inherit color-inherit underline-hover text-left pl4 pr4",attrs:{to:e.url},domProps:{textContent:t._s(e.label)}}):i("a",{staticClass:"el-button pl4 pr4 el-button--text inline-block w-inherit color-inherit underline-hover text-left pl4 pr4",attrs:{href:e.url,rel:"noopener"},domProps:{textContent:t._s(e.label)}})],1)})),0),i("el-divider",{staticClass:"mt2 mb2"}),i("ul",{staticClass:"flex justify-content-space-around pt2 p2",class:{dark:t.dark,light:!t.dark}},t._l(t.infoMenuLinks.social,(function(t,e){return i("li",{key:e,staticClass:"seamless-hoverw4 h4 p2 vertical-align circle"},[i("a",{staticClass:"color-inherit",attrs:{href:t.url,target:"_blank",rel:"noopener"}},[i("fa",{staticClass:"sm-icon",attrs:{icon:t.icon}})],1)])})),0),i("el-divider",{staticClass:"mt2 mb2"}),i("li",{staticClass:"w-fit-full h10"},[i("el-button",{staticClass:"inline-block w-fit-full text-left pl4 pr4 color-inherit",attrs:{type:"text"},on:{click:t.logOutUser}},[i("strong",[t._v("Sign out")])])],1)],1),i("div",{staticClass:"no-outline circle icon-wrapper",attrs:{slot:"reference",tabindex:"0"},on:{click:function(e){return t.toggleVisibility(!t.isVisible)},keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")&&t._k(e.keyCode,"space",32,e.key,[" ","Spacebar"])?null:t.toggleVisibility(!t.isVisible)}},slot:"reference"},[t.userImage?i("el-avatar",{attrs:{size:"small",src:t.$auth.user.picture}}):i("fa",{staticClass:"md-icon user-icon",attrs:{icon:["fas","user-circle"]}})],1)])},s=[],r=(i("caad"),i("b0c0"),i("2532"),i("0316")),l=i("5f61"),a=i("95c1"),o=i("46cf"),c=i("f8dc"),u=i("e67d"),d=i.n(u),f={data:function(){return{isVisible:!1}},computed:{dark:function(){return this.$store.state.isDark},infoMenuLinks:function(){return a["a"]},userName:function(){return this.$auth.user?this.$auth.user.name:"Loading..."},currentRoute:function(){return this.$route.path.includes("/user")?{label:"Back to map",to:"/app"}:{label:"Dashboard",to:"/user"}},userImage:function(){return this.$auth.user&&this.$auth.user.picture},popoverClassGiver:function(){var t="popover";return this.dark?t+=" dark":t+=" light",t}},methods:{closeMenu:function(){this.toggleVisibility(!1)},toggleVisibility:function(t){this.isVisible=t},toggleDarkMode:function(){"/app"==this.currentRoute.to?this.$store.commit("".concat(r["k"]),!this.dark):o["a"].$emit("".concat(c["g"]))},logOutUser:function(){Object(l["b"])("auth.token-session"),this.$auth.logout()}},directives:{ClickOutside:d.a}},p=f,h=(i("cbc5"),i("2877")),k=Object(h["a"])(p,n,s,!1,null,"7747b0d2",null);e["default"]=k.exports}}]);
//# sourceMappingURL=chunk-72d7424a.74b27434.js.map
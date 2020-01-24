import Vue from 'vue'
import ElementUI from 'element-ui'
import '../assets/theme/index.css'
import 'element-ui/lib/theme-chalk/base.css'
import 'element-ui/lib/theme-chalk/display.css'
import locale from 'element-ui/lib/locale/lang/en'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

Vue.component(CollapseTransition.name, CollapseTransition)
Vue.use(ElementUI, { locale })

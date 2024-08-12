import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zn from './zh-cn'

Vue.use(VueI18n)

const messages = {
	zn
}

const i18n = new VueI18n({
	locale: 'zn',
	messages
})

export default i18n

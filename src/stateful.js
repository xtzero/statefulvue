/**
 * 保存状态的自定义指令
 * @Author xt
 * 
 * 在任意需要保存状态的组件上使用 v-stateful，即可在当前Vue生命周期内，路由切换的过程中保留其绑定的值
 * eg: <el-input v-model="value" v-stateful></el-input>
 * 
 * 可以对组件提供 :query-key="queryKey" 属性，来优先从queryKey的url参数里获取值
 * eg: <el-input v-model="value" query-key="input_value" v-stateful></el-input>
 * 
 * 对于一些不是使用v-model绑定的组件，需要为其指定 state-key，来让stateful指令知道需要绑定到data下的哪个值
 * 这些组件往往不是双向绑定，所以需要将key绑定到 $store.getters.randNum 上，来保证每次都会更新组件状态
 * eg: <pagination v-stateful state-key="page.page" :page.sync="page.page" :key="$store.getters.randNum" />
 * 如果一个组件使用了v-stateful，但没有v-model和state-key，则会报错：使用v-stateful，v-model 和 :state-key至少有其一
 * 
 * 2021年07月28日
 */
export default {
    bind(el, binding, vnode) {
        let expression = null
        if (vnode.data.model && vnode.data.model.expression) {
            expression = vnode.data.model.expression
        } else {
            expression = vnode.data.attrs['state-key']
        }
        if (!expression) {
            console.error("使用v-stateful，v-model 和 :state-key至少有其一");
            return false
        }
        // 这玩意是这个组件的全局唯一key
        const vnodeKey = `${vnode.child.$route.fullPath}_${expression}`

        /**
         * 拿旧值
         * 如果有:query-key，且query里提供了值，那么值从query里拿
         * 否则去store里拿旧值
         */
        let oldValue = null
        const queryKey = vnode.child.$attrs['query-key']
        const queryValue = vnode.context.$route.query[queryKey]
        if (queryKey && queryValue) {
            oldValue = queryValue
        } else {
            oldValue = vnode.context.$store.state.stateful.pageState[vnodeKey]
        }
        console.log("取值结果：queryKey:", queryKey, "queryValue:", queryValue, "vnodeKey:", vnodeKey, "expression: ", expression, "oldValue:", oldValue);
        if (!oldValue) return false

        // 给页面上绑定值赋值
        let context = vnode.context
        expression.split(".").forEach((v, k) => {
            if (k == expression.split(".").length - 1 && oldValue != null) {
                // Vue.set(vnode.context[v], v, oldValue)
                context[v] = oldValue
            } else {
                context = context[v]    
            }
        })
    },
   
    componentUpdated(el, binding, vnode, oldVnode) {
        // 唯一key
        let expression = null
        if (vnode.data.model && vnode.data.model.expression) {
            expression = vnode.data.model.expression
        } else {
            expression = vnode.data.attrs['state-key']
        }
        if (!expression) {
            console.error("使用v-stateful，v-model 和 :state-key至少有其一");
            return false
        }
        // 这玩意是这个组件的全局唯一key
        const vnodeKey = `${vnode.child.$route.fullPath}_${expression}`

        let context = vnode.context
        
        // 拿到当前值
        expression.split(".").forEach((v, k) => {
            context = context[v]
            console.log('context:', context)
        })

        // 存store里
        console.log("存入store。", vnodeKey, '=>', context);
        vnode.context.$store.state.stateful.pageState[vnodeKey] = context
        
        console.log("store结果：", vnode.context.$store.state.stateful.pageState);
    }
}

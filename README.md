# statefulvue

> 保存状态的自定义指令
>
> xt
>
> [官网地址](http://xtzero.me/_posts/stateful202108/index.html)

在任意需要保存状态的组件上使用 v-stateful，即可在当前Vue生命周期内，路由切换的过程中保留其绑定的值。例如：

```html
<el-input v-model="value" v-stateful></el-input>
```

可以对组件提供 :query-key="queryKey" 属性，来优先从queryKey的url参数里获取值。例如：

```html
<el-input v-model="value" query-key="input_value" v-stateful></el-input>
```

对于一些不是使用v-model绑定的组件，需要为其指定 state-key，来让stateful指令知道需要绑定到data下的哪个值
这些组件往往不是双向绑定，所以需要将key绑定到 $store.getters.randNum 上，来保证每次都会更新组件状态。例如：

```html
<pagination v-stateful state-key="page.page" :page.sync="page.page" :key="$store.getters.randNum" />
```

如果一个组件使用了v-stateful，但没有v-model和state-key，则会报错：使用v-stateful，v-model 和 :state-key至少有其一。

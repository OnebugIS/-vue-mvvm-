import Vue from 'vue';
// 借用vue本身的数据响应式机制使state相应化，从而使state变化立刻相应在依赖的视图中
class TStore {
  //  constructor 是一种用于创建和初始化class创建的对象的特殊方法
  // new 实例化会自动包含一个constructor属性，指向他们的构造函数
  constructor(options) {  // options就是new Store的实例化
    this.state = options.state;
    this.mutations = options.mutations;
    this.actions = options.actions;
    // 借用vue本身的数据响应式机制  托管   单向数据流
    // 原理 借助了vue的数据劫持，state的值变成响应式，如果state有改变，就通知组件
    new Vue({  // vuex对于vue有强耦，只能用于vue redux则不是
      data: {
        state: this.state
      }
    });
  }

  commit(type, payload) {
    const mutation = this.mutations[type];   // 拿到函数 执行
    mutation(this.state, payload); // 传参给mutation 也就是this.mutations函数
  }

  dispatch(type, payload) {
    const action = this.actions[type];
    const ctx = {  // 上下文
      commit: this.commit.bind(this),
      state: this.state,
      dispatch: this.dispatch.bind(this)
    };
    console.log(ctx, 'ctx')
    return action(ctx, payload);
  }
}


export default new TStore({
  state: {
    count: 1
  },
  mutations: {
    add(state) {
      state.count++;
    }
  },
  actions: {
    add({ commit }) {
      commit('add')
    }
  }
})
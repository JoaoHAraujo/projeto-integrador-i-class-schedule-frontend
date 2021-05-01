import { api } from '../services/index'
import { eventBus } from '../main'

export default {
  data () {
    return {
      dataBase: null,
      loading: true
    }
  },
  methods: {
    async get (url) {
      this.loading = true
      try {
        const { data } = await api.get(url)
        this.dataBase = data.data
        this.loading = false
      } catch (err) {
        console.log(err)
      }
    },
    delete (url, id) {
      this.$bvModal
        .msgBoxConfirm('Tem certeza que deseja deletar?', {
          title: 'Confirmação',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          cancelVariant: 'primary',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true,
          okTitle: 'Sim',
          cancelTitle: 'Não'
        })
        .then(value => {
          if (value) {
            api.delete(`${url}/${id}`).then(() => {
              const roomIndex = this.dataBase.findIndex(data => {
                console.log(data)
                return data.id === id
              })
              this.dataBase.splice(roomIndex, 1)
            })
          }
        })
    }
  },
  created () {
    eventBus.$on('update', (payload, changeType) => {
      if (changeType === 'added') {
        console.log('entrou')

        const arrayLength = this.dataBase.length
        console.log(payload)

        this.$set(this.dataBase, arrayLength, payload)
      }

      if (changeType === 'modified') {
        this.dataBase.forEach((item, index) => {
          if (payload.id === item.id) {
            this.$set(this.dataBase, index, payload)
          }
        })
      }
    })
  }
}

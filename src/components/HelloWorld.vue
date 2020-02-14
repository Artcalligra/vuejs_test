<template>
  <div class="test">
    <div class="container">
      <div class="row mt-3">
        <div class="col-md-9">
          <b-form-group label="Курс USD:" label-for="input-1" class="form-inline">
            <b-form-input
              id="input-course"
              v-model="coursesUSD"
              type="number"
              step="0.01"
              :min="0"
              class="col-5 ml-3"
              :style="changeUSD"
              required
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-md-3 text-right">
          <b-button v-b-modal.modal-1>Корзина({{cart.length}})</b-button>

          <b-modal id="modal-1" size="xl" centered title="Корзина" hide-footer>
            <table class="table">
              <thead>
                <th style="width: 55%">Наименование товара</th>
                <th style="width: 15%">Количество</th>
                <th style="width: 15%">Цена</th>
                <th style="width: 15%"></th>
              </thead>
              <tr v-if="!cart.length">
                <td>Пусто</td>
              </tr>
              <tr v-else v-for="(item, index) in cart" :key="index">
                <td style="width: 55%">{{item.catname}}. {{item.name}}</td>
                <td style="width: 15%">
                  <input
                    type="number"
                    v-model="item.col"
                    :min="1"
                    :max="item.P"
                    :class="item.col==item.P? 'iseQually':''"
                  />
                </td>
                <td
                  style="width: 15%"
                >{{(Number(item.C * coursesUSD) * Number(item.col)).toFixed(2)}} p.</td>
                <td style="width: 15%">
                  <button @click="removeCart(index)">Удалить</button>
                </td>
              </tr>
            </table>
            <p v-if="cart.length" class="text-right">
              <b>Общая стоимость:</b>
              {{colCart}} p.
            </p>
          </b-modal>
        </div>
      </div>
      <div class="row">
        <table class="table table-hover" v-for="(items, index) in dataa" :key="index">
          <thead v-b-toggle="items.name">
            <tr>
              <th scope="col">{{ items.name }}</th>
            </tr>
          </thead>
          <b-collapse visible :id="items.name">
            <tbody>
              <tr v-if="!Object.keys(items.data).length">
                <td>Пусто</td>
              </tr>
              <tr v-else v-for="(item, ind) in items.data" :key="ind">
                <td style="width: 60%">{{item.name}}</td>
                <td style="width: 15%">{{item.P}}</td>
                <td style="width: 15%">{{ (item.C * coursesUSD).toFixed(2) }}</td>
                <td style="width: 10%">
                  <button @click="addToCart(item.id, index, ind)">Добавить</button>
                </td>
              </tr>
            </tbody>
          </b-collapse>
        </table>
        <p>{{ errors }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import convert from "xml-js";

export default {
  name: "test",
  data() {
    return {
      dates: [],
      names: [],
      cart: [],
      coursesUSD: null,
      errors: null,
      changeUSD: null
    };
  },
  watch: {
    // подсветка поля с курсом валют
    coursesUSD: {
      handler(val, oldVal) {
        return oldVal == null
          ? (this.changeUSD = "border-color: #ced4da;")
          : val > oldVal
          ? (this.changeUSD = "border-color: red;")
          : (this.changeUSD = "border-color: green;");
      },
      immediate: true
    }
  },
  computed: {
    // подсчёт общей суммы корзины
    colCart: function() {
      let col = 0;
      Object.entries(this.cart).forEach(([keys, value]) => {
        col += value.C * this.coursesUSD * value.col;
      });
      return col.toFixed(2);
    },
    // создание нового объекта для работы с данными
    dataa: function() {
      let data = [];

      Object.entries(this.names).forEach(([keys, value]) => {
        data[keys] = {
          id: keys,
          name: value.G,
          data: {}
        };
        Object.entries(value.B).forEach(([key, element]) => {
          Object.entries(this.dates).forEach(([keyss, elements]) => {
            if (elements.T == key) {
              data[keys].data[key] = {
                id: key,
                name: element.N,
                C: elements.C,
                P: elements.P
              };
            }
          });
        });
      });
      return Object.values(data);
    }
  },

  mounted() {
    this.getData();
    this.getNames();
    this.getCources();
    window.setInterval(() => {
      this.getData();
    }, 15000);
  },
  methods: {
    // добавление в корзину
    addToCart(id, indcat, ind) {
      //id - id товара
      //indcat - индекс категории
      //ind - индекс подкатегории
      let itemsProcessed = 0;
      let newitem = true;

      //перебор корзины для поиска уже существующих товаров, в случае нахождения добавляем количество +1
      for (let key in this.cart) {
        if (this.cart[key].id == id) {
          newitem = false;
          if (this.cart[key].col != this.cart[key].P) {
            this.cart[key].col++;
          }
        }
        //если товар новый, то просто добавляем его в корзину
        if (this.cart[key].id == this.cart[this.cart.length - 1].id) {
          if (newitem) {
            this.cart[id] = {
              id: id,
              catname: this.dataa[indcat].name,
              name: this.dataa[indcat].data[ind].name,
              C: this.dataa[indcat].data[ind].C,
              P: this.dataa[indcat].data[ind].P,
              col: 1
            };
          }
        }
      }
      //если корзина пустая, то добавляем товар
      if (this.cart.length == 0) {
        this.cart[id] = {
          id: id,
          catname: this.dataa[indcat].name,
          name: this.dataa[indcat].data[ind].name,
          C: this.dataa[indcat].data[ind].C,
          P: this.dataa[indcat].data[ind].P,
          col: 1
        };
      }
      this.cart = Object.values(this.cart);
    },
    removeCart(index) {
      this.cart.splice(index, 1);
    },
    // получение данных из файла data.json
    getData() {
      axios
        .get("http://localhost:3000/files/data.json")
        .then(response => {
          this.dates = response.data.Value.Goods;
        })
        .catch(error => {
          this.errors = error;
        });
    },
    // получение данных из файла names.json
    getNames() {
      axios
        .get("http://localhost:3000/files/names.json")
        .then(response => {
          this.names = response.data;
        })
        .catch(error => {
          this.errors = error;
        });
    },
    // получение курсов валют с нацбанка
    getCources() {
      axios
        .get("http://nbrb.by/Services/XmlExRates.aspx")
        .then(response => {
          let courses = convert.xml2json(response.data, {
            compact: true,
            spaces: 4
          });
          let jsonCourses = JSON.parse(courses);
          Object.entries(jsonCourses.DailyExRates.Currency).forEach(
            ([key, value]) => {
              if (value.CharCode._text == "USD") {
                this.coursesUSD = Number(value.Rate._text).toFixed(2);
              }
            }
          );
        })
        .catch(error => {
          this.errors = error;
        });
    }
  }
};
</script>

<style>
.iseQually {
  border-color: red;
}

thead {
  border: 2px solid #dee2e6;
}

.modal-title {
  margin: auto;
}
.modal-header .close {
  padding: 0 !important;
  margin: 0 !important;
}
.modal-dialog {
  max-width: 650px !important;
}
</style>

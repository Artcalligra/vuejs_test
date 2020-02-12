<template>
  <div class="test">
    <div class="container">
      <div class="row mt-3">
        <div class="col-md-9 ">
          <!-- <div class="row "> -->
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
          <!-- </div> -->
        </div>
        <div class="col-md-3 text-right">
          <b-button v-b-modal.modal-1>Корзина({{cart.length}})</b-button>

          <b-modal id="modal-1" size="xl" centered title="Корзина" hide-footer>
            <!-- <div class="col-12"> -->
            <table class="table">
              <thead>
                <tr>
                  <th>Наименование товара</th>
                  <th>Количество</th>
                  <th>Цена</th>
                </tr>
              </thead>
              <tr v-if="!cart.length">
                <td>Пусто</td>
              </tr>
              <tr v-else v-for="(item, index) in cart" :key="index">
                <td>{{item.catname}}. {{item.name}}</td>
                <td>
                  <input
                    type="number"
                    v-model="item.col"
                    :min="1"
                    :max="item.P"
                    :style="item.equallyCol ? 'border-color: red' :  ''"
                  />
                </td>
                <td>{{(Number(item.C * coursesUSD) * Number(item.col)).toFixed(2)}}</td>
                <td>
                  <button @click="removeCart(index)">&#10008;</button>
                </td>
              </tr>
            </table>
            <p v-if="cart.length" class="text-right">Общая стоимость {{colCart}}</p>
            <!-- </div> -->
          </b-modal>
        </div>
      </div>
      <!-- <button @click="addToCart(1,1)">test</button> -->
      <div class="row">
        <table class="table table-hover" v-for="(items, index) in dataa" :key="index">
          <thead v-b-toggle="items.name">
            <tr>
              <th>{{ items.name }}</th>
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
                  <button @click="addToCart(item.id, index, ind)">&plus;</button>
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
  props: {
    msg: String
  },
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
    coursesUSD: {
      handler(val, oldVal) {
        if(oldVal==null){
          this.changeUSD = "border-color: #ced4da;";
        }else if(val > oldVal){

          this.changeUSD = "border-color: green;";
        } else {
          this.changeUSD = "border-color: red;";
        }
        // console.log("changed!", val, oldVal);
        return this.changeUSD;
      },
      immediate: true
    }
  },
  computed: {
    colCart: function() {
      let col = 0;
      Object.entries(this.cart).forEach(([keys, value]) => {
        col += value.C * this.coursesUSD * value.col;
      });
      return col.toFixed(2);
    },
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
      // console.log(data);
      return Object.values(data);
    }
  },

  mounted() {
    this.getData();
    this.getNames();
    this.getCources();
    /* window.setInterval(() => {
      this.getData();
      this.getNames();
      // this.getCources();
    }, 15000); */
  },
  methods: {
    addToCart(id, indcat, ind) {
      //id - id товара
      //indcat - индекс категории
      //ind - индекс подкатегории

      let newitem = true;
      let equallyCol = false;
      //перебор корзины для поиска уже существующих товаров, в случае нахождения добавляем количество +1
      for (let key in this.cart) {
        if (this.cart[key].id == id) {
          newitem = false;
          if (this.cart[key].col != this.cart[key].P) {
            this.cart[key].col++;
            this.cart[key].equallyCol = false;
          } else {
            this.cart[key].equallyCol = true;
          }
        } else {
          newitem = true;
        }
      }
      //если товар новый, то просто добавляем его в корзину
      if (newitem || this.cart.length == 0) {
        if (this.dataa[indcat].data[ind].P == 1) {
          equallyCol = true;
        }
        this.cart[id] = {
          id: id,
          catname: this.dataa[indcat].name,
          name: this.dataa[indcat].data[ind].name,
          C: this.dataa[indcat].data[ind].C,
          P: this.dataa[indcat].data[ind].P,
          col: 1,
          equallyCol: equallyCol
        };
      }
      console.log(this.cart);
      this.cart = Object.values(this.cart);
    },
    removeCart(index) {
      this.cart.splice(index, 1);
    },
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
.table td {
  vertical-align: middle !important;
}
.modal-title {
  margin: auto;
}
.modal-header .close {
  padding: 0 !important;
  margin: 0 !important;
}
</style>

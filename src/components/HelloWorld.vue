<template>
  <div class="test">
    <div class="container">
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
                <td>{{item.name}}({{item.P}})</td>
                <!-- <td>{{item.C | coursesFilter}}</td> -->
                <td>{{ item.C }}</td>
                <button @click="addToCart(item)">Добавить</button>
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
      counter: 0,
      coursesUSD: null,
      errors: null
    };
  },
  computed: {
    dataa: function() {
      let data = [];

      Object.entries(this.names).forEach(([keys, value]) => {
        data[keys] = {
          name: value.G,
          data: {}
        };
        Object.entries(value.B).forEach(([key, element]) => {
          Object.entries(this.dates).forEach(([keyss, elements]) => {
            if (elements.T == key) {
              data[keys].data[key] = {
                name: element.N,
                C: (elements.C * this.coursesUSD).toFixed(2),
                P: elements.P
              };
            }
          });
        });
      });
      console.log(data);
      return Object.values(data);
    }
  },

  /*  mounted() {
    setInterval(function() {
      this.getData();
      this.getNames();
      this.getCources();
    }, 15000);
  }, */
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
    addToCart: function(product) {
      console.log(product);
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
                this.coursesUSD = value.Rate._text;
                // console.log(key, value.Rate._text);
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} */
</style>

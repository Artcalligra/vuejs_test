<template>
  <div class="test">
    <table class="table table-hover" v-for="(name, index) in names" :key="index">
      <thead v-b-toggle="name.G">
        <tr>
          <th scope="col">{{ name.G }}</th>
        </tr>
      </thead>
      <b-collapse visible :id="name.G">
        <tr v-if="!itemsDates(index).length">
          <td>Пусто</td>
        </tr>
        <tr v-for="(date, ind) in itemsDates(index)" :key="ind">
          <td>{{name.B[date.T].N}}</td>
          <td>{{date.C}}</td>
          <td>{{date.P}}</td>
        </tr>
      </b-collapse>
    </table>

    <!-- <div v-for="(date, index) in dates" :key="index">{{ index }}-{{ date }}</div> -->
    <!-- <p v-for="(value, index1) in names" :key="index1">{{ index1 }}-{{ value }}</p> -->

    <!-- <pre>{{ names }}</pre> -->
    <!-- <pre>{{ dates }}</pre> -->

    <!-- <pre>{{ courses }}</pre> -->
    <p>{{createObject}}</p>
    <p>{{ errors }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "test",
  props: {
    msg: String
  },
  data() {
    return {
      dates: null,
      names: null,
      courses: null,
      errors: null
    };
  },
  computed: {
    createObject: function() {
      let myObject = new Object();

      Object.entries(this.names).forEach(([keys, value]) => {
        console.log(keys, value.G);

        Object.entries(value.B).forEach(([key, element]) => {
          if (typeof this.dates[key] == "object") {
            myObject = {
              name: value.G,
              nameCategory: element.N,
              date:this.dates[key]
            };

            //в верхний объект в поле дата добавть имя и содержимое объекта dates[key]
          }
          console.log(myObject);
          console.log(typeof this.dates[key] == "object");
          //if (element.G == key) {
          //  myObject[key] += element;
          //}
          console.log(key, element.N);
        });
      });

      return myObject;
    }
  },
  methods: {
    itemsDates(id) {
      return this.dates.filter(item => item.G == id);
    }
  },

  mounted() {
    axios
      .get("http://localhost:3000/files/data.json")
      .then(response => {
        this.dates = response.data.Value.Goods;
        console.log(JSON.stringify(this.dates));
      })
      .catch(error => {
        this.errors = error;
      });

    axios
      .get("http://localhost:3000/files/names.json")
      .then(response => {
        this.names = response.data;
        // console.log(JSON.stringify(this.names));
      })
      .catch(error => {
        this.errors = error;
      });

    axios
      .get("http://nbrb.by/Services/XmlExRates.aspx")
      .then(response => {
        this.courses = response.data;
      })
      .catch(error => {
        this.errors = error;
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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

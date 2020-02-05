<template>
  <div class="test">

    <table class="table table-hover " v-for="(name, index) in names" :key="index">
      <thead v-b-toggle="name.G">
        <tr>
          <th scope="col">{{ name.G }}</th>
        </tr>
      </thead>
      <b-collapse visible  :id=name.G>
        <tbody v-for="(date, ind) in itemsDates(index)" :key="ind">
          <tr>
            <td>{{itemsName(name.B)}}</td>
            <!-- <td v-for="(title, indx) in name.B" :key="indx">{{title.N}}</td> -->

            <td>{{date.C}}</td>
            <td>{{date.P}}</td>
          </tr>
        </tbody>
      </b-collapse>
    </table>

    <!-- <div v-for="(date, index) in dates" :key="index">{{ index }}-{{ date }}</div> -->
    <!-- <p v-for="(value, index1) in names" :key="index1">{{ index1 }}-{{ value }}</p> -->

    <pre>{{ names }}</pre>
    <!-- <pre>{{ dates }}</pre> -->

    <!-- <pre>{{ courses }}</pre> -->
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
  methods: {
    itemsDates(id) {
      return this.dates.filter(item => item.G == id);
    },

    itemsName(arr) {
      return arr; /* .filter(item => (item.id == '1')); */
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

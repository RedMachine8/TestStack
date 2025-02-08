
<script>
import axios from 'axios';

export default {
  data() {
    return {
      orgs: [],
      addForm: {
        id: '',
        name: '',
        FIODir: '',
        Phone: '',
      },
      filter: '',
      sortedbyASC: true,
    };
  },
  methods: {
    getOrganizations() {
      const path = 'http://127.0.0.1:5000/organizations';
      axios.get(path)
        .then((res) => {
          this.orgs = res.data.orgs;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    },
    addOrg(payload) {
      const path = 'http://127.0.0.1:5000/organizations';
      axios.post(path, payload)
        .then(() => {
          this.getOrganizations();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          this.getOrganizations();
        });
    },
    initForm() {
      this.addForm.id = '';
      this.addForm.name = '';
      this.addForm.FIODir = '';
      this.addForm.Phone = '';
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$refs.addOrgModal.hide();
      const payload = {
        name: this.addForm.name,
        FIODir: this.addForm.FIODir,
        phone: this.addForm.Phone,
      };
      this.addOrg(payload);
      this.initForm();
    },
    onReset(evt) {
      evt.preventDefault();
      this.$refs.addOrgModal.hide();
      this.initForm();
    },
    removeOrg(orgID) {
      const path = `http://127.0.0.1:5000/organizations/${orgID}`;
      axios.delete(path)
        .then(() => {
          this.getOrganizations();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          this.getOrganizations();
        });
    },
    onDeleteOrg(org) {
      this.removeOrg(org.id);
    },
    sortlist(sortBY) {
      if (this.sortedbyASC) {
        this.orgs.sort((x, y) => (x[sortBY] > y[sortBY] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.orgs.sort((x, y) => (x[sortBY] < y[sortBY] ? 1 : -1));
        this.sortedbyASC = true;
      }
    },
  },
  computed: {
    filterOrgs() {
      const filteredOrgs = this.filter === ''
        ? this.orgs
        : this.orgs.filter(wo => Object.values(wo.FIODir).join('').indexOf(this.filter) !== -1);
      return filteredOrgs;
    },
    validated() {
      return this.addForm.name.trim() && this.addForm.FIODir.trim() && this.addForm.Phone.trim();
    },
  },
  created() {
    this.getOrganizations();
  },
};
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1>Организации</h1>
        <hr><br><br>
        <b-row>
          <b-col>
            <input type="text"
             placeholder="Найти по ФИО"
             v-model="filter" />
          </b-col>
          <b-col></b-col>
          <b-col></b-col>
          <b-col></b-col>
          <b-col></b-col>
          <b-col></b-col>
          <b-col>
            <button type="button" class="btn btn-success btn-sm" v-b-modal.org-modal>
            Добавить</button>
          </b-col>
        </b-row>
        <br><br>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col" @click="sortlist(name)">Название</th>
              <th scope="col" @click="sortlist(FIODir)">ФИО директора</th>
              <th scope="col">Телефон</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(org, index) in filterOrgs" :key="index">
              <td>{{ org.name }}</td>
              <td>{{ org.FIODir }}</td>
              <td>{{ org.phone}} </td>
              <td>
                <button type="button" class="btn btn-danger btn-sm"
                        @click="onDeleteOrg(org)">X</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <b-modal ref="addOrgModal" id="org-modal" title="Добавить организацию" hide-footer>
      <b-form @submit="onSubmit" @reset="onReset" class="w-100">
        <b-form-group id="form-name-group" >
          <b-form-input id="form-name-input"
                        type="text"
                        v-model="addForm.name"
                        required
                        placeholder="Название">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-phone-group">
          <b-form-input id="form-phone-input"
                        type="text"
                        v-model="addForm.Phone"
                        required
                        placeholder="Номер телефона">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-Fio-group">
          <b-form-input id="form-Fio-input"
                        type="text"
                        v-model="addForm.FIODir"
                        required
                        placeholder="ФИО директора">
          </b-form-input>
        </b-form-group>
        <b-button type="reset" variant="danger">Отмена</b-button>
        <b-button type="submit" :disabled="!validated" variant="primary">Ок</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<style>

</style>

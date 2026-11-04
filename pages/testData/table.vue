<template>
  <view>
    <u-search v-model="searchQuery" placeholder="请输入学校名称进行搜索" @change="filterData" />

    <u-table :data="paginatedData">
      <u-tr>
        <u-th>
          <u-checkbox @change="toggleSelectAll" v-model="isAllSelected"></u-checkbox>
        </u-th>
        <u-th>学校</u-th>
        <u-th>班级</u-th>
        <u-th>年龄</u-th>
      </u-tr>
      <u-tr v-for="item in paginatedData" :key="item.id">
        <u-td>
                  <u-checkbox v-model="item.selected"></u-checkbox>
                </u-td>
        <u-td>{{ item.school }}</u-td>
        <u-td>{{ item.class }}</u-td>
        <u-td>{{ item.age }}</u-td>
      </u-tr>
    </u-table>
    <div class="pagination">
      <u-button @click="prevPage" :disabled="currentPage === 1">上一页</u-button>
      <view>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</view>
      <u-button @click="nextPage" :disabled="currentPage === totalPages">下一页</u-button>
    </div>
    <u-button type="primary" @click="deleteSelected">删除选中项</u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { id: 1, school: '浙江大学', class: '二年级', age: 22, selected: false },
        { id: 2, school: '清华大学', class: '05班', age: 20, selected: false },
        { id: 3, school: '北京大学', class: '三年级', age: 21, selected: false },
        { id: 4, school: '复旦大学', class: '一年级', age: 19, selected: false },
        { id: 5, school: '上海交通大学', class: '四年级', age: 23, selected: false },
        { id: 6, school: '南京大学', class: '二年级', age: 22, selected: false },
        { id: 7, school: '中山大学', class: '三年级', age: 21, selected: false },
        { id: 8, school: '哈尔滨工业大学', class: '一年级', age: 18, selected: false },
        { id: 9, school: '西安交通大学', class: '四年级', age: 24, selected: false },
        { id: 10, school: '同济大学', class: '二年级', age: 20, selected: false }
      ],
      filteredData: [],
      selectedRows: [],
      isAllSelected: false,
      currentPage: 1,
      pageSize: 5,
      searchQuery: ''
    };
  },
  computed: {
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.pageSize);
    }
  },
  methods: {
    filterData() {
      this.filteredData = this.tableData.filter(item =>
        item.school.includes(this.searchQuery)
      );
      this.currentPage = 1;
    },
    toggleSelectAll() {
      this.isAllSelected = !this.isAllSelected;
      this.paginatedData.forEach(item => {
        item.selected = this.isAllSelected;
      });
    },
    deleteSelected() {
      this.tableData = this.tableData.filter(item => !item.selected);
      this.filterData();
      this.selectedRows = [];
      this.isAllSelected = false;
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  created() {
    this.filteredData = this.tableData;
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination view {
  margin: 0 10px;
}
.checkbox-cell {
  width: 30px;
}
</style>
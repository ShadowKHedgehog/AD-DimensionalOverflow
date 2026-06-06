<script>
import ClassicRemnantDimensionsTab from "./ClassicRemnantDimensionsTab";
import ModernRemnantDimensionsTab from "./ModernRemnantDimensionsTab";

export default {
  name: "RemnantDimensionsTab",
  components: {
    ClassicRemnantDimensionsTab,
    ModernRemnantDimensionsTab
  },
  computed: {
    activeComponent() {
      return this.$viewModel.newUI
        ? "ModernRemnantDimensionsTab"
        : "ClassicRemnantDimensionsTab";
    }
  }
};
</script>

<template>
  <component :is="activeComponent" />
</template>
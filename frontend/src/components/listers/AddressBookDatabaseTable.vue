<template>

    <v-data-table
            :headers="headers"
            :items="addressBookDatabase"
            :items-per-page="5"
            class="elevation-1"
    ></v-data-table>

</template>

<script>

    export default {
        name: 'AddressBookDatabaseList',
        props: {
            value: Object,
            editMode: Boolean,
            isNew: Boolean
        },
        data: () => ({
            headers: [
                { 
                    text: "id", 
                    value: "id" 
                },
            ],
            addressBookDatabase : [],
        }),
        async created() {
            if(!this.value) this.value = [];
        },
        methods: {
        }
    }
</script>


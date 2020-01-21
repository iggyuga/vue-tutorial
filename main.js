//Add a description to the data object with the value "A pair of warm, fuzzy socks". Then display the description using an expression in an p element, underneath the h1.

Vue.component('product-review', {
    template: `
   <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="Name">
        </p>
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
            <label for="rating">Rating:</label>
            <select id="review" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p>
            <label for="recommend">Would you recomment this product?</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
            <input type="submit" value="Submit">
        </p>
    </form>
    `
    ,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                }
                this.$emit('review-submitted', productReview)
                this.name= null
                this.review= null
                this.rating= null
            }
            else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")

            }
        }
    }
})

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required:true
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `,
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        }
    },
    template: `
            <div class="product">
            <div class="product-image">
                <img v-bind:src='image' />
            </div>
    
            <div class="product-info">
                <h1>{{ title }}</h1>
                <h2>{{ description }}</h2>
                <!-- <a :href="image" >img link</a> -->
                <p v-if="inStock">In Stock</p>
                <p v-else :class="{ outOfStock: !inStock}">Out of Stock</p>
                <p>{{ sale }}</p>
                <p>Shipping: {{ shipping }}</p>

                <product-details :details="details"></product-details>

                <div v-for="(variant, index) in variants" 
                    :key="variant.variantId"
                    class="color-box"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)"
                    >
                    <!-- <ul style="margin: 20px">
                        <li v-for="s in variant.variantSize">{{ s }}</li>
                    </ul> -->
                </div>

                <button @click="addToCart" 
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }"
                        >Add to Cart</button>
                <button @click="removeFromCart">Remove</button>

            </div>
            <div>
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
            </div>
            <ul>
            <li v-for="review in reviews">
                <p>{{ review.name }}</p>
                <p>{{ review.rating }}</p>
                <p>{{ review.review }}</p>
            </li>
            <product-review @review-submitted="addReview"></product-review>

        </div>`
    ,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Carrot',
            description: 'Lots of Vitamins',
            // image: './assets/vmSocks-green-onWhite.jpg',
            selectedVariant: 0,
            inventory: 0,
            onSale: true,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantSize: ["small", "medium", "large"],
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 0
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantSize: ["small", "medium"],
                    variantImage: './assets/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 11

                }
            ],
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' are on sale!'
            }
            return this.brand + ' ' + this.product + ' are not on sale'
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return 2.99
        }
    }
})
var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeItem(id) {
            for (var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                    break;
                }
            }
        }
    }
})


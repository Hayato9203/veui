import Overlay from '@/components/Overlay'
import Vue from 'vue'

describe('components/Overlay', () => {
  it('should put the layer root node directly below the body.', done => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const vm = new Vue({
      el: div,
      render () {
        return <Overlay />
      }
    })

    setTimeout(() => {
      const overlay = vm.$children[0].$vnode.componentInstance
      expect(overlay.$refs.box).toBe(
        document.body.querySelector('.veui-overlay-box')
      )

      vm.$destroy()
      done()
    })
  })

  it('should provide default slot.', done => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const vm = new Vue({
      el: div,
      render () {
        return <Overlay>content</Overlay>
      }
    })

    setTimeout(() => {
      const overlay = vm.$children[0].$vnode.componentInstance
      expect(overlay.$refs.box.innerHTML).toBe('content')
      vm.$destroy()
      done()
    })
  })

  it('should generate proper zIndex when the two overlays have parent-child relationship.', done => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const vm = new Vue({
      el: div,
      render () {
        return (
          <Overlay class="parent-overlay">
            <Overlay class="child-overlay" />
          </Overlay>
        )
      }
    })

    setTimeout(() => {
      const parent = document.querySelector('.parent-overlay').__vue__
      const child = document.querySelector('.child-overlay').__vue__
      expect(+parent.$refs.box.style.zIndex).toBe(200)
      expect(+child.$refs.box.style.zIndex).toBe(201)
      vm.$destroy()
      done()
    })
  })

  it('should cover the previous\'s overlay\'s child overlay.', done => {
    new Vue({
      data () {
        return {
          parentVisible: false,
          childVisible: false,
          nextVisible: false
        }
      },
      render () {
        return (
          <div>
            <Overlay ref="parent" open={this.parentVisible}>
              <Overlay ref="child" open={this.childVisible} />
            </Overlay>
            <Overlay ref="next" open={this.nextVisible}></Overlay>
          </div>
        )
      },
      mounted () {
        setTimeout(() => {
          this.parentVisible = true

          setTimeout(() => {
            this.nextVisible = true

            setTimeout(() => {
              this.childVisible = true

              setTimeout(() => {
                expect(this.$refs.parent.zIndex).toBe(200)
                expect(this.$refs.child.zIndex).toBe(201)
                expect(this.$refs.next.zIndex).toBe(202)
                done()
              })
            })
          })
        })
      }
    }).$mount()
  })
})

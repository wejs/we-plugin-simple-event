/**
 * Simple event model
 */

module.exports = function M(we) {
  const model = {
    definition: {
      published: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: false,
        formFieldType: null
      },
      highlighted: {
        type: we.db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        formFieldType: null
      },
      name: {
        type: we.db.Sequelize.STRING,
        allowNull: false
      },
      about: {
        type: we.db.Sequelize.TEXT,
        allowNull: false,
        formFieldType: 'textarea',
      },
      body: {
        type: we.db.Sequelize.TEXT,
        allowNull: false,
        formFieldType: 'html',
        formFieldHeight: 400
      },
      publishedAt: {
        type: we.db.Sequelize.DATE,
        allowNull: true
      },
      registrationStartDate: { type: we.db.Sequelize.DATE },
      registrationEndDate: { type: we.db.Sequelize.DATE },
      eventStartDate: { type: we.db.Sequelize.DATE },
      eventEndDate: { type: we.db.Sequelize.DATE },
      registrationManagerName: { type: we.db.Sequelize.TEXT },
      registrationManagerEmail: {
        type: we.db.Sequelize.STRING(1200),
        validate: { isEmail: true }
      },
      vacancies: {
        type: we.db.Sequelize.INTEGER,
        formFieldType: 'number'
      },
      registrationLink: {
        type: we.db.Sequelize.TEXT,
        allowNull: true,
        formFieldType: 'textarea'
      },
      /**
       * registration status
       *
       * return closed, closed_before, open, closed_no_vacancies or closed_after
       *
       * @type {Object}
       */
      registrationStatus: {
        type: we.db.Sequelize.VIRTUAL,
        formFieldType: null,
        get() {
          let startDate = this.getDataValue('registrationStartDate');
          let endDate = this.getDataValue('registrationEndDate');

          if (startDate) startDate = we.utils.moment(new Date(startDate) ).unix();
          if (endDate) endDate = we.utils.moment( new Date(endDate) ).unix();
          const now = we.utils.moment().unix();

          // before registration
          if (startDate && (now < startDate) ) return 'closed_before';
          // after registration date
          if (endDate && (now > endDate) ) return 'closed_after';

          if (startDate && endDate) {
            // is open if are between start and end date
            if ((now > startDate) && (now < endDate)) {
              return 'open';
            }
          }

          return 'closed';
        }
      },
    },
    associations: {
      creator: {
        type: 'belongsTo',
        model: 'user'
      },
      cats: {
        type: 'belongsToMany',
        // as: 'Tasks',
        through: {
          model: 'modelsterms',
          unique: false,
          constraints: false,
          scope: {
            modelName: 'hotel-event'
          }
        },
        constraints: false,
        foreignKey: 'modelId',
        // otherKey: 'termId',
        //type: 'hasMay',
        model: 'term'
      }
    },
    options: {
      // title field, for default title record pages
      titleField: 'name',

      termFields: {
        tags: {
          vocabularyName: null,
          canCreate: true,
          formFieldMultiple: true,
          onlyLowercase: true
        },
        category: {
          vocabularyName: 'Category',
          canCreate: false,
          formFieldMultiple: false
        }
      },

      imageFields: {
        featuredImage: { formFieldMultiple: false },
        images: { formFieldMultiple: true }
      },
      classMethods: {
        // suport to we.js url alias feature
        urlAlias(record) {
          return {
            alias: '/eventos/' + record.id + '-'+  we.utils
              .string( record.name || '' )
              .truncate(60)
              .slugify().s,
            target: '/simple-event/' + record.id,
          };
        }

      },
      instanceMethods: {},
      hooks: {
        beforeCreate(r, opts, done) {
          if (r.published) {
            r.publishedAt = Date.now();
          }

          done();
          return r;
        },

        beforeUpdate(r, opts, done) {
          if (r.published && !r.publishedAt) {
            // set publishedAt on publish:
            r.publishedAt = Date.now();
          } else if (!r.published && r.publishedAt) {
            // reset publishedAt on unpublish
            r.publishedAt = null;
          }

          done();
          return r;
        }
      }
    }
  };

  return model;
};

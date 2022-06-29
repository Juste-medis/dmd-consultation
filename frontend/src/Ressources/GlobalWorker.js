const GlobalWorker = {
  SELECTED_STUFF: 0,
  JODIT_CONTENT: 0,
  SELECTED_COUPON: 0,
  SELECTED_MAIL: 0,
  MAIN_QUIZZ: {
    ID: 1,
    section_id: 1,
    description: '',
    title: '',
    quizzes: []
  },
  DefaultModel: {
    Quizes: {
      type: 1,
      order: 1,
      q: '',
      rs: [
        {
          r: 'Vrai',
          true: 1
        },
        {
          r: 'Faux'
        }
      ]
    },

    User: {
      username: '',
      user_email: '',
      user_firtname: '',
      user_lastname: '',
      description: '',
      job: '',
      user_url: '',
      display_name: '',
      user_registered: '',
      photourl: '',
      user_status: 1,
      last_connected: '',
      new_pass: '',
      visibility: 'enable',
      user_pass: '',
      certificate: '[]',
      downloads: [],
      favorites: [],
      visitedcourses: [],
      cart: []
    },
    Formator_form: [
      { name: 'firstname', label: 'Nom', type: 'text' },
      { name: 'lastname', label: 'Prenoms', type: 'text' },
      { name: 'age', label: 'Votre Age', type: 'number' },
      { name: 'job', label: 'Profession', type: 'text' },
      { name: 'country', label: 'Pays', type: 'text' },
      { name: 'mail', label: 'Adresse e-mail', type: 'mail' },
      { name: 'phone', label: 'Numéro de téléphone', type: 'text' },
      {
        name: 'creditCard',
        label: 'Numero de votre carte de crédit',
        type: 'text',
        pattern: '[0-9.]+'
      },
      {
        name: 'formation_domain',
        label: 'Domaine de la formation ',
        type: 'text'
      },
      {
        name: 'formation_title',
        label: 'Titre de formation à dispensée ',
        type: 'text'
      },

      {
        name: 'course_description',
        label: 'Description du cours ',
        type: 'text'
      },
      {
        name: 'cibled_public',
        label: 'Votre public cible pour cette formation',
        type: 'text'
      },
      {
        name: 'course_impact',
        label: 'Impact de ce cours sur le marché actuel ?',
        type: 'text'
      },
      { name: 'experience_year', label: "Année d'experience", type: 'number' }
    ],
    Formator_forml: [
      {
        name: 'motivation_reason',
        label: 'Pourquoi aimeriez-vous travailler avec Sedami.com',
        type: 'text'
      }
    ],
    Formator_form_last: [
      {
        name: 'skill_level',
        label: 'Niveau de maitrise de cette compétence ',
        values: [
          { label: 'Basic', value: 'basic' },
          { label: 'Moyen', value: 'moyen' },
          { label: 'Elevé', value: 'elevé' }
        ],
        type: 'radio'
      },
      {
        name: 'equipement_level',
        label: 'Avez vous des équipements pour faire des vidéos de qualités',
        values: [
          {
            label: "Oui, j'ai une camera pour l'enregistrement de mes cours",
            value: 'yes_camera'
          },
          {
            label:
              "Oui, J'ai un bon téléphone pour l'enregistrement de mes cours",
            value: 'yes_phone'
          },
          {
            label: "Non, J'ai rien du tous pour l'enregistrement",
            value: 'none'
          }
        ],
        type: 'radio'
      },
      {
        name: 'accompagnable_online',
        label: 'Etes-vous en mesure de faire des accompagnements en ligne?',
        values: [
          { label: 'Oui', value: 'Oui' },
          { label: 'Non', value: 'Non' }
        ],
        type: 'radio'
      },
      {
        name: 'presential_course',
        label: 'Pouvez-vous faire des cours en présentiel? ',

        values: [
          { label: 'Oui', value: 'Oui' },
          { label: 'Non', value: 'Non' }
        ],
        type: 'radio'
      }
    ]
  }
};

export default GlobalWorker;
